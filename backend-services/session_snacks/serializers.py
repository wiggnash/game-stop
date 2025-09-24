from rest_framework import serializers
from .models import SessionSnack

class SessionSnackSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionSnack
        fields = '__all__'
