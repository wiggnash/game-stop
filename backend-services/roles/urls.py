from django.urls import path
from .views import RoleListCreateView, RoleRetrieveUpdateDestroyView

urlpatterns = [
    path('', RoleListCreateView.as_view(), name='role-list-create'),
    path('<int:pk>/', RoleRetrieveUpdateDestroyView.as_view(), name='role-retrieve-update-destroy'),
]
