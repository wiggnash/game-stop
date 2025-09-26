from django.urls import path
from .views import UserProfileListCreateView, UserProfileRetrieveUpdateDestroyView, LoginView, RegisterView, UserProfileMeView

urlpatterns = [
    path('', UserProfileListCreateView.as_view(), name='UserProfile-list-create'),
    path('<int:pk>/', UserProfileRetrieveUpdateDestroyView.as_view(), name='UserProfile-retrieve-update-destroy'),
    path('me/', UserProfileMeView.as_view(), name='UserProfile-me'),

    # login and register apis
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
]
