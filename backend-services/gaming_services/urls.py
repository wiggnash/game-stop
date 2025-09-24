from django.urls import path
from .views import GamingServiceListCreateView, GamingServiceRetrieveUpdateDestroyView

urlpatterns = [
    path('', GamingServiceListCreateView.as_view(), name='GamingService-list-create'),
    path('<int:pk>/', GamingServiceRetrieveUpdateDestroyView.as_view(), name='GamingService-retrieve-update-destroy'),
]
