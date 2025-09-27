from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Duration(models.Model):
    TYPE_CHOICES = [
        ('MINUTE', 'Minute'),
        ('HOUR', 'Hour'),
    ]

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='durations_created'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='durations_updated'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)
    type = models.CharField(
        max_length=10,
        choices=TYPE_CHOICES,
        default='HOUR'
    )
    duration = models.FloatField(
        help_text="Duration value"
    )

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.duration} {self.get_type_display()}"
