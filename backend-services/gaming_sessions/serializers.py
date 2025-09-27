from rest_framework import serializers
from .models import GamingSession
from payments.models import Payment
from session_snacks.models import SessionSnack
from gaming_services.models import Station
from durations.models import Duration

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

class StationDropdownSerializer(serializers.ModelSerializer):
    gaming_service_type = serializers.CharField(source='gaming_service.service_type', read_only=True)
    class Meta:
        model = Station
        fields = ['id', 'name', 'gaming_service_type']

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
