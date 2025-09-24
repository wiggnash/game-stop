from django.db import models
from django.contrib.auth.models import User
from gaming_services.models import GamingService
from simple_history.models import HistoricalRecords

class GamingSession(models.Model):
    # Choices
    SESSION_STATUS_CHOICES = [
        ('ACTIVE', 'ACTIVE'),
        ('COMPLETED', 'COMPLETED'),
        ('CANCELLED', 'CANCELLED'),
    ]

    # Relations
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='gaming_sessions_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='gaming_sessions_updated')
    service = models.ForeignKey(GamingService, on_delete=models.CASCADE, related_name='gaming_sessions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gaming_sessions')

    check_in_time = models.DateTimeField()
    check_out_time = models.DateTimeField(null=True, blank=True)
    calculated_gaming_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_session_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    session_status = models.CharField(max_length=20, choices=SESSION_STATUS_CHOICES, default='ACTIVE')
    is_walk_in_customer = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    # Audit fields
    archive = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Add this line for simple history
    history = HistoricalRecords()

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"Session {self.id} - {self.user.username} ({self.service.name})"
