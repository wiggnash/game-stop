from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from service_types.models import ServiceType
from game_types.models import GameType
from durations.models import Duration
from simple_history.models import HistoricalRecords


class ServicePrice(models.Model):
    """
    Pricing configuration based on service type, game type, duration, and player count
    """
    # Main fields
    service_type = models.ForeignKey(
        ServiceType,
        on_delete=models.CASCADE,
        related_name='service_prices'
    )
    game_type = models.ForeignKey(
        GameType,
        on_delete=models.CASCADE,
        related_name='service_prices'
    )
    duration = models.ForeignKey(
        Duration,
        on_delete=models.CASCADE,
        related_name='service_prices'
    )
    player_count = models.PositiveIntegerField(
        default=1,
        null=True,
        blank=True,
        validators=[MinValueValidator(1)],
        help_text="Minimum player count for this pricing"
    )
    max_player_count = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text="Maximum player count for this pricing"
    )
    price = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text="Price for this service configuration"
    )

    # Common audit fields
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='service_prices_created'
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='service_prices_updated'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    # History tracking
    history = HistoricalRecords()

    class Meta:
        ordering = ['-id']
        unique_together = [
            'service_type',
            'game_type',
            'duration',
            'player_count',
            'max_player_count'
        ]

    def __str__(self):
        player_text = f"{self.player_count}P" if self.player_count == self.max_player_count else f"{self.player_count}-{self.max_player_count}P"
        return f"{self.service_type.name} | {self.game_type.name} | {self.duration} | {player_text} | ₹{self.price}"

    def is_valid_for_player_count(self, count):
        """Check if a given player count is valid for this price"""
        if self.player_count is None:
            return count <= self.max_player_count
        return self.player_count <= count <= self.max_player_count
