from django.db import models
from django.contrib.auth.models import User
from service_types.models import ServiceType
from simple_history.models import HistoricalRecords


class GameType(models.Model):
    """
    Specific game types (e.g., PS4, PS5, Meta Quest, Xbox)
    """
    # Main fields
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    service_type = models.ForeignKey(
        ServiceType,
        on_delete=models.CASCADE,
        related_name='game_types'
    )

    # Common audit fields
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='game_types_created'
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='game_types_updated'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    # History tracking
    history = HistoricalRecords()

    class Meta:
        ordering = ['-id']
        unique_together = ['name', 'service_type']

    def __str__(self):
        return f"{self.name} ({self.service_type.name})"
