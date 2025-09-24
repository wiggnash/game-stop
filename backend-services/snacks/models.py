from django.db import models
from django.contrib.auth.models import User

class Snack(models.Model):
    # Choices
    CATEGORY_CHOICES = [
        ('DRINKS', 'DRINKS'),
        ('SNACKS', 'SNACKS'),
        ('MEALS', 'MEALS'),
    ]

    # Relations
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='snacks_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='snacks_updated')

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    restock_level = models.IntegerField(default=10)
    is_available = models.BooleanField(default=True)

    # Audit Fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.name} - ₹{self.unit_price}"

    @property
    def needs_restock(self):
        return self.stock_quantity <= self.restock_level
