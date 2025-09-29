from django.urls import path
from .views import GameTypeListCreateView, GameTypeRetrieveUpdateDestroyView

urlpatterns = [
    path('', GameTypeListCreateView.as_view(), name='GameType-list-create'),
    path('<int:pk>/', GameTypeRetrieveUpdateDestroyView.as_view(), name='GameType-detail'),
]
