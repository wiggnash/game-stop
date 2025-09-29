# service_types/models.py
from django.db import models
from django.contrib.auth.models import User
from simple_history.models import HistoricalRecords


class ServiceType(models.Model):
    """
    Base service types (e.g., Gaming, VR, Pool, Driving)
    """
    # Main fields
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    # Common audit fields
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='service_types_created'
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='service_types_updated'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    # History tracking
    history = HistoricalRecords()

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.name
