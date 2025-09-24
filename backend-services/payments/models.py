from django.db import models
from django.contrib.auth.models import User
from gaming_sessions.models import GamingSession

class Payment(models.Model):
    # Choices
    PAYMENT_METHOD_CHOICES = [
        ('CASH', 'CASH'),
        ('UPI', 'UPI'),
        ('CARD', 'CARD'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'PENDING'),
        ('COMPLETED', 'COMPLETED'),
        ('FAILED', 'FAILED'),
    ]

    # Relations
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='payments_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='payments_updated')
    session = models.ForeignKey(GamingSession, on_delete=models.CASCADE, related_name='payments')

    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    transaction_reference = models.CharField(max_length=100, blank=True, null=True)

    # Audit Fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"Payment {self.id} - Session #{self.session.id} - ₹{self.amount_paid} ({self.payment_method})"
