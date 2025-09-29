from django.urls import path
from .views import ServicePriceListCreateView, ServicePriceRetrieveUpdateDestroyView

urlpatterns = [
    path('', ServicePriceListCreateView.as_view(), name='ServicePrice-list-create'),
    path('<int:pk>/', ServicePriceRetrieveUpdateDestroyView.as_view(), name='ServicePrice-detail'),
]
