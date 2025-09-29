from django.db import models
from django.contrib.auth.models import User
from game_types.models import GameType
from service_types.models import ServiceType
from simple_history.models import HistoricalRecords


class Station(models.Model):
    """
    Physical stations/consoles in the gaming cafe
    """
    # Main fields
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    game_type = models.ForeignKey(
        GameType,
        on_delete=models.CASCADE,
        related_name='stations'
    )
    service_type = models.ForeignKey(
        ServiceType,
        on_delete=models.CASCADE,
        related_name='stations'
    )
    is_active = models.BooleanField(default=True)

    # Common audit fields
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='stations_created'
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='stations_updated'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    # History tracking
    history = HistoricalRecords()

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.name} - {self.game_type.name}"
