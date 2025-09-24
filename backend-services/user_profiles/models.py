from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    # Relations
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='user_profiles_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='user_profiles_updated')

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    # Audit Fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    archive = models.BooleanField(default=False)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f"{self.user.username}'s Profile"
