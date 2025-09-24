from rest_framework import serializers
from .models import GamingService

class GamingServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GamingService
        fields = '__all__'
