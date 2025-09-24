from django.urls import path
from .views import GamingSessionListCreateView, GamingSessionRetrieveUpdateDestroyView

urlpatterns = [
    path('', GamingSessionListCreateView.as_view(), name='GamingSession-list-create'),
    path('<int:pk>/', GamingSessionRetrieveUpdateDestroyView.as_view(), name='GamingSession-retrieve-update-destroy'),
]
