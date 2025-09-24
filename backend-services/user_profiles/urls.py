from django.urls import path
from .views import UserProfileListCreateView, UserProfileRetrieveUpdateDestroyView

urlpatterns = [
    path('', UserProfileListCreateView.as_view(), name='UserProfile-list-create'),
    path('<int:pk>/', UserProfileRetrieveUpdateDestroyView.as_view(), name='UserProfile-retrieve-update-destroy'),
]
