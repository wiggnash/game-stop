from django.urls import path
from .views import UserProfileListCreateView, UserProfileRetrieveUpdateDestroyView, LoginView, RegisterView

urlpatterns = [
    path('', UserProfileListCreateView.as_view(), name='UserProfile-list-create'),
    path('<int:pk>/', UserProfileRetrieveUpdateDestroyView.as_view(), name='UserProfile-retrieve-update-destroy'),

    # login and register apis
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
]
