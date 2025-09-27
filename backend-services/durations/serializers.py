from rest_framework import serializers
from .models import Duration

class DurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Duration
        fields = [
            'id',
            'type',
            'duration',
            'archive',
        ]
