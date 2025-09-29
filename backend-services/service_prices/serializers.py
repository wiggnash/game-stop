from rest_framework import serializers
from .models import ServicePrice

class ServicePriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePrice
        fields = '__all__'
