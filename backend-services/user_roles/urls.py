from django.urls import path
from .views import UserRoleListCreateView, UserRoleRetrieveUpdateDestroyView

urlpatterns = [
    path('', UserRoleListCreateView.as_view(), name='user-roles-create'),
    path('<int:pk>/', UserRoleRetrieveUpdateDestroyView.as_view(), name='user-roles-detail'),
]
