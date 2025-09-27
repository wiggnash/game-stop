from django.urls import path
from .views import DurationListCreateView, DurationRetrieveUpdateDestroyView

urlpatterns = [
    path('', DurationListCreateView.as_view(), name='duration-list-create'),
    path('<int:pk>/', DurationRetrieveUpdateDestroyView.as_view(), name='duration-detail'),
]
