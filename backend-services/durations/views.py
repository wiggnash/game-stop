from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Duration
from .serializers import DurationSerializer

class DurationListCreateView(generics.ListCreateAPIView):
    queryset = Duration.objects.all()
    serializer_class = DurationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Duration.objects.filter(archive=False)

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )

class DurationRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Duration.objects.all()
    serializer_class = DurationSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        # Soft delete by setting archive to True
        instance.archive = True
        instance.updated_by = self.request.user
        instance.save()
