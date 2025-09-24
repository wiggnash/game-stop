from rest_framework import serializers
from .models import GamingSession

class GamingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GamingSession
        fields = '__all__'
