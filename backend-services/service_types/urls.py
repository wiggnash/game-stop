from django.urls import path
from .views import ServiceTypeListCreateView, ServiceTypeRetrieveUpdateDestroyView

urlpatterns = [
    path('', ServiceTypeListCreateView.as_view(), name='ServiceType-list-create'),
    path('<int:pk>/', ServiceTypeRetrieveUpdateDestroyView.as_view(), name='ServiceType-detail'),
]
