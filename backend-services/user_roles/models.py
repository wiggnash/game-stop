from django.db import models
from django.contrib.auth.models import User
from roles.models import Role

class UserRole(models.Model):
    # Relations
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='user_roles_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='user_roles_updated')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_roles')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='user_roles')

    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    class Meta:
        ordering = ['-id']
        unique_together = ('user', 'role')

    def __str__(self):
        return f"{self.user.username} - {self.role.role_name}"
