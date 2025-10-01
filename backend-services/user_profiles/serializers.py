from rest_framework import serializers
from .models import UserProfile
from roles.models import Role
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import re

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserMeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone_number = serializers.CharField(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'phone_number']

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

class UserProfileListSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'user_id',
            'username',
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'is_active'
        ]

class UserProfileCreateAdminSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=True, max_length=100)
    last_name = serializers.CharField(required=True, max_length=150)
    username = serializers.CharField(required=True, max_length=150)
    phone_number = serializers.CharField(required=True, max_length=15)
    email = serializers.CharField(required=False, allow_blank=True)
    role = serializers.IntegerField(required=True)
    password = serializers.CharField(required=False, write_only=True, min_length=8)
    confirm_password = serializers.CharField(required=False, write_only=True)

    def validate_phone_number(self, value):
        phone_regex = re.compile(r'^\+91[6-9]\d{9}$')
        if phone_regex.match(value):
            raise serializers.ValidationError("Please Enter an Valid Phone number")

        if UserProfile.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number already exists")

        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")

        return value

    def validate_email(self, value):
        if value and User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate(self, data):
        role = data.get("role")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        admin_role = Role.objects.get(id=role)

        if admin_role:
            if not password:
                raise serializers.ValidationError({"password": "Password is required for admin users."})
            if not confirm_password:
                raise serializers.ValidationError({"confirm_password": "Confirm password is required for admin users."})
            if password != confirm_password:
                raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        return data
