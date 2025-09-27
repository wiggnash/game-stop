from django.db import models
from django.contrib.auth.models import User


class GamingService(models.Model):
    SERVICE_TYPE_CHOICES = [
        ('PS4', 'PlayStation 4'),
        ('PS5', 'PlayStation 5'),
        ('PC', 'PC'),
        ('VR', 'VR'),
        ('DRIVING', 'Driving Simulator'),
    ]

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='gaming_services_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='gaming_services_updated')

    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES, unique=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.get_service_type_display()} - {self.hourly_rate}/hr"


class Station(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='stations_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='stations_updated')

    gaming_service = models.ForeignKey(GamingService, on_delete=models.CASCADE, related_name='stations')
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    is_occupied = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.name} ({self.gaming_service.get_service_type_display()})"
