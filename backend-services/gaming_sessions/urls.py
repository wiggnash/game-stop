from django.urls import path
from .views import (
    GamingSessionListCreateView,
    GamingSessionRetrieveUpdateDestroyView,
    GamingSessionListActiveView,
    GamingSessionListPastView,
    GamingSessionListDropDownView,
)

urlpatterns = [
    path('', GamingSessionListCreateView.as_view(), name='GamingSession-list-create'),
    path('<int:pk>/', GamingSessionRetrieveUpdateDestroyView.as_view(), name='GamingSession-retrieve-update-destroy'),
    path('active/', GamingSessionListActiveView.as_view(), name='GamingSession-list-active'),
    path('past/', GamingSessionListPastView.as_view(), name='GamingSession-list-past'),
    path('drop-downs/', GamingSessionListDropDownView.as_view(), name='GamingSession-list-dropdown'),
]
