from django.urls import path
from .views import SessionSnackListCreateView, SessionSnackRetrieveUpdateDestroyView

urlpatterns = [
    path('', SessionSnackListCreateView.as_view(), name='SessionSnack-list-create'),
    path('<int:pk>/', SessionSnackRetrieveUpdateDestroyView.as_view(), name='SessionSnack-retrieve-update-destroy'),
]
