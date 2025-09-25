from rest_framework import serializers
from .models import GamingSession

class GamingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GamingSession
        fields = '__all__'

from rest_framework import serializers
from .models import GamingSession

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
