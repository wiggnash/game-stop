from django.urls import path
from .views import (
    UserProfileListCreateView,
    UserProfileRetrieveUpdateDestroyView,
    LoginView,
    RegisterView,
    UserProfileMeView,
    UserProfileCreateByAdminView
)

urlpatterns = [
    path('', UserProfileListCreateView.as_view(), name='UserProfile-list-create'),
    path('<int:pk>/', UserProfileRetrieveUpdateDestroyView.as_view(), name='UserProfile-retrieve-update-destroy'),
    path('me/', UserProfileMeView.as_view(), name='UserProfile-me'),
    path('create/', UserProfileCreateByAdminView.as_view(), name='UserProfile-create-user-by-admin'),

    # login and register apis
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
]
