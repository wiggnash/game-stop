from django.db import models
from django.contrib.auth.models import User

class GamingService(models.Model):
    # Choices
    SERVICE_TYPE_CHOICES = [
        ('CONSOLE', 'CONSOLE'),
        ('PC', 'PC'),
        ('VR', 'VR'),
        ('DRIVING', 'DRIVING'),
    ]

    # Relations
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='gaming_services_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='gaming_services_updated')

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2)

    # Audit Fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.name} ({self.service_type})"
