from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import GameType
from .serializers import GameTypeSerializer

class GameTypeListCreateView(generics.ListCreateAPIView):
    queryset = GameType.objects.all()
    serializer_class = GameTypeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GameType.objects.filter(archive=False)

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )

class GameTypeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GameType.objects.all()
    serializer_class = GameTypeSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        # Soft delete by setting archive to True
        instance.archive = True
        instance.updated_by = self.request.user
        instance.save()
