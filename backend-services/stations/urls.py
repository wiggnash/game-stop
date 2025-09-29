from django.urls import path
from .views import StationListCreateView, StationRetrieveUpdateDestroyView

urlpatterns = [
    path('', StationListCreateView.as_view(), name='Station-list-create'),
    path('<int:pk>/', StationRetrieveUpdateDestroyView.as_view(), name='Station-detail'),
]
