from django.db import models
from django.contrib.auth.models import User
from gaming_sessions.models import GamingSession
from snacks.models import Snack

class SessionSnack(models.Model):
    # Relations
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='session_snacks_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='session_snacks_updated')
    gaming_session = models.ForeignKey(GamingSession, on_delete=models.CASCADE, related_name='session_snacks')
    snack = models.ForeignKey(Snack, on_delete=models.CASCADE, related_name='session_snacks')

    quantity = models.IntegerField(default=1)
    unit_price_at_time = models.DecimalField(max_digits=8, decimal_places=2)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)

    # Audit Fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"Session {self.gaming_session.id} - {self.quantity}x {self.snack.name}"

    def save(self, *args, **kwargs):
        # Automatically calculate total_cost when saving
        self.total_cost = self.quantity * self.unit_price_at_time
        super().save(*args, **kwargs)
