from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    loginType = serializers.ChoiceField(choices=[('email', 'Email'), ('phone', 'Phone')])
    password = serializers.CharField(required=True, write_only=True)
    rememberMe = serializers.BooleanField(default=False, required=False)

    def validate(self, data):
        identifier = data.get('identifier')
        login_type = data.get('loginType')
        password = data.get('password')

        if identifier and login_type and password:
            user = None

            if login_type == 'email':
                try:
                    user_obj = User.objects.get(email=identifier)
                    user = authenticate(email=identifier, password=password)
                except User.DoesNotExist:
                    raise serializers.ValidationError("Invalid email or password")
                except Exception as e:
                    print(f"An error occurred: {e}")

            if login_type == 'phone':
                try:
                    user_profile_obj = UserProfile.objects.get(phone_number=identifier)
                    user = authenticate(username=user_profile_obj.user.username, password=password)
                except UserProfile.DoesNotExist:
                    raise serializers.ValidationError("Invalid phone number or password")
                except Exception as e:
                    print(f"An error occurred: {e}")

            if user and user.is_active:
                data['user'] = user
            else:
                raise serializers.ValidationError("Please check the credentials")

        else:
            raise serializers.ValidationError("Invalid input")

        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    # Required UserProfile fields
    phone_number = serializers.CharField(max_length=15, required=True)

    # Optional UserProfile fields
    address = serializers.CharField(required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'password', 'password_confirm',
            'phone_number', 'address', 'date_of_birth'
        ]
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},  # Email not required
        }

    def validate_phone_number(self, value):
        """
        Check that phone number is unique across all UserProfiles
        """
        if UserProfile.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return value

    def validate(self, data):
        """
        Check that the two password entries match.
        """
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return data
