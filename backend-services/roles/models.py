from django.db import models
from django.contrib.auth.models import User

class Role(models.Model):
    # Relations
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='roles_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='roles_updated')

    role_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    class Meta:
        ordering = ['role_name']

    def __str__(self):
        return self.role_name
