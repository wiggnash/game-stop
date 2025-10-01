from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q

# Import Models
from roles.models import Role
from django.contrib.auth.models import User
from .models import UserProfile
from user_roles.models import UserRole

# Serializers
from .serializers import (
    UserProfileSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserMeSerializer,
    UserProfileListSerializer,
    UserProfileCreateAdminSerializer
)

class UserProfileListCreateView(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserProfileListSerializer
        return UserProfileSerializer

    def get_queryset(self):
        queryset = UserProfile.objects.filter(archive=False).select_related('user')

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(user__username__icontains=search) |
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search)
            )
        return queryset

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )

        return Response(serializer.data)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

class UserProfileRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def perform_update(self, serializer):
        serializer.save(
            updated_by=self.request.user
        )

        return Response(serializer.data)

    def perform_destroy(self, instance):
        instance.archive = True
        instance.updated_by = self.request.user
        instance.save()

class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'message': 'Login successful',
            'tokens': {
                'access': str(access_token),
                'refresh': str(refresh)
            }
        }, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # Anyone can register

    def create(self, request, *args, **kwargs):
        # Validate the data using serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get validated data
        validated_data = serializer.validated_data

        # Create user and profile logic
        user = self.create_user_and_profile(validated_data)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'message': 'User registered successfully',
            'tokens': {
                'access': str(access_token),
                'refresh': str(refresh)
            }
        }, status=status.HTTP_201_CREATED)

    def create_user_and_profile(self, validated_data):
        """
        Create and return a new user.
        """
        # Remove password_confirm as it's not needed for user creation
        validated_data.pop('password_confirm')

        # Extract profile fields
        phone_number = validated_data.pop('phone_number')
        address = validated_data.pop('address', '')
        date_of_birth = validated_data.pop('date_of_birth', None)

        # Create Auth User
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )

        # Create UserProfile
        UserProfile.objects.create(
            user=user,
            phone_number=phone_number,
            address=address,
            date_of_birth=date_of_birth,
            created_by=user,
            updated_by=user
        )

        return user

class UserProfileMeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserMeSerializer

    def get_object(self):
        # Return the UserProfile for the authenticated user
        return self.request.user.profile

class UserProfileCreateByAdminView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileCreateAdminSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Extract the data after validation
        first_name = serializer.validated_data.get('first_name')
        last_name = serializer.validated_data.get('last_name')
        username = serializer.validated_data.get('username')
        phone_number = serializer.validated_data.get('phone_number')
        email = serializer.validated_data.get('email', '')
        role_id = serializer.validated_data.get('role')
        password = serializer.validated_data.get('password')

        # What type of user are we going to create
        try:
            role_type = Role.objects.get(id=role_id)
        except Role.DoesNotExist:
            return Response(
                {"error" : "Invalid Role is selected."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if role_type.role_name.lower() == "admin":
            user_password=password
        elif role_type.role_name.lower() == "customer":
            user_password=f"{phone_number}@gamestop"

        # Create the Auth User
        user = User.objects.create_user(
            username=username,
            email=email,
            password=user_password,
            first_name=first_name,
            last_name=last_name
        )

        # Create User Profile
        user_profile = UserProfile.objects.create(
            user=user,
            phone_number=phone_number,
            created_by=self.request.user,
            updated_by=self.request.user
        )

        # Create User Role
        user_role = UserRole.objects.create(
            user=user,
            role=role_type,
            created_by=self.request.user,
            updated_by=self.request.user
        )

        response_data = {
            "username" : username,
            "phone_number": phone_number
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
