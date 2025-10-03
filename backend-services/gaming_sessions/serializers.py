from rest_framework import serializers
from .models import GamingSession
from django.contrib.auth.models import User

from stations.models import Station
from payments.models import Payment
from session_snacks.models import SessionSnack
from durations.models import Duration
from game_types.models import GameType
from service_types.models import ServiceType

class GamingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GamingSession
        fields = [
            'id', 'user', 'station', 'duration', 'notes', 'check_in_time',
            'check_out_time', 'calculated_gaming_cost', 'total_session_cost',
            'session_status', 'is_walk_in_customer', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'check_out_time', 'calculated_gaming_cost',
            'total_session_cost', 'created_at', 'updated_at'
        ]

class GamingSessionCreateSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(write_only=True)
    service_type_id = serializers.IntegerField(write_only=True)
    game_type_id = serializers.IntegerField(write_only=True)
    station_id = serializers.IntegerField(write_only=True)
    duration_id = serializers.IntegerField(write_only=True)
    number_of_players = serializers.IntegerField(write_only=True)

    class Meta:
        model = GamingSession
        fields = [
            'user_id',
            'service_type_id',
            'game_type_id',
            'station_id',
            'duration_id',
            'number_of_players',
            'notes',
        ]

        extra_kwargs = {
            'notes': {'required': False, 'allow_blank': True, 'default': ""},
            'number_of_players': {'required': False, 'default': 1},
        }

    def validate_user_id(self, value):
        """Validate that the user exists"""
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(f"User with id {value} does not exist.")
        return value

    def validate_service_type_id(self, value):
        """Validate that the service type exists"""
        try:
            ServiceType.objects.get(id=value)
        except ServiceType.DoesNotExist:
            raise serializers.ValidationError(f"Service type with id {value} does not exist.")
        return value

    def validate_game_type_id(self, value):
        """Validate that the game type exists"""
        try:
            GameType.objects.get(id=value)
        except GameType.DoesNotExist:
            raise serializers.ValidationError(f"Game type with id {value} does not exist.")
        return value

    def validate_station_id(self, value):
        """Validate that the station exists and is not occupied"""
        try:
            station = Station.objects.get(id=value)
            if not station.is_active:
                raise serializers.ValidationError(
                    f"Station {station.name} is already occupied."
                )
        except Station.DoesNotExist:
            raise serializers.ValidationError(f"Station with id {value} does not exist.")
        return value

    def validate_duration_id(self, value):
        """Validate that the duration exists"""
        try:
            Duration.objects.get(id=value)
        except Duration.DoesNotExist:
            raise serializers.ValidationError(f"Duration with id {value} does not exist.")
        return value

    def validate_number_of_players(self, value):
        """Validate that number of players is positive"""
        if value <= 0:
            raise serializers.ValidationError("Number of players must be at least 1.")
        return value

class DurationDropdownSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = Duration
        fields = ['id', 'duration', 'type']

class GamingSessionActiveDashboardSerializer(serializers.ModelSerializer):
    user__username = serializers.CharField(source="user.username", read_only=True)
    station__name = serializers.CharField(source="station.name", read_only=True)
    gaming_service__service_type = serializers.CharField(source="station.gaming_service.service_type", read_only=True)

    class Meta:
        model = GamingSession
        fields = (
            'id',
            'user',
            'user__username',
            'station',
            'station__name',
            'gaming_service__service_type',
            'session_status',
            'check_in_time',
            'check_out_time',
            'calculated_gaming_cost',
            'total_session_cost',
        )

class SessionSnackDetailSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='snack.name', read_only=True)

    class Meta:
        model = SessionSnack
        fields = ['id', 'item_name', 'quantity', 'unit_price_at_time', 'total_cost']

class PaymentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'amount_paid', 'payment_method', 'payment_status', 'transaction_reference', 'created_at']

class GamingSessionDetailSerializer(serializers.ModelSerializer):
    # Session Summary fields
    customer_username = serializers.CharField(source='user.username', read_only=True)
    customer_full_name = serializers.SerializerMethodField()
    station_name = serializers.CharField(source='station.name', read_only=True)
    game_service = serializers.CharField(source='station.gaming_service.service_type', read_only=True)

    # Services & Snacks - using nested serializers
    gaming_service_item = serializers.SerializerMethodField()
    snacks_items = SessionSnackDetailSerializer(source='session_snacks', many=True, read_only=True)

    # Payment History
    payment_history = PaymentDetailSerializer(source='payments', many=True, read_only=True)

    class Meta:
        model = GamingSession
        fields = [
            # Session Summary
            'id',
            'customer_username',
            'customer_full_name',
            'check_in_time',
            'station',
            'station_name',
            'game_service',
            'session_status',

            # Services & Snacks
            'gaming_service_item',
            'snacks_items',

            # Payment History
            'payment_history',

            # Other useful fields
            'check_out_time',
            'calculated_gaming_cost',
            'total_session_cost',
            'notes',
        ]

    def get_customer_full_name(self, obj):
        """Get customer's full name or username as fallback"""
        if obj.user.first_name and obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return obj.user.username

    def get_gaming_service_item(self, obj):
        """Format gaming service as an item with quantity, price, total"""
        return {
            'item_name': f"Gaming Session ({obj.station.gaming_service.service_type})",
            'quantity': 1,
            'unit_price': str(obj.calculated_gaming_cost),
            'total_cost': str(obj.calculated_gaming_cost)
        }


class ActiveStatationDropDownSerializer(serializers.ModelSerializer):
    game_type_name = serializers.CharField(source="game_type.name", read_only=True)
    service_type = serializers.IntegerField(source="game_type.service_type.id", read_only=True)
    service_type_name = serializers.CharField(source="game_type.service_type.name", read_only=True)

    class Meta:
        model = Station
        fields = [
            'id',
            'name',
            'game_type',
            'game_type_name',
            'service_type',
            'service_type_name',
            'is_active'
        ]
