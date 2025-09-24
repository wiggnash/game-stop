from django.urls import path
from .views import SnackListCreateView, SnackRetrieveUpdateDestroyView

urlpatterns = [
    path('', SnackListCreateView.as_view(), name='Snack-list-create'),
    path('<int:pk>/', SnackRetrieveUpdateDestroyView.as_view(), name='Snack-retrieve-update-destroy'),
]
