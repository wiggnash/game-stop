from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Station
from .serializers import StationSerializer

class StationListCreateView(generics.ListCreateAPIView):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Station.objects.filter(archive=False)

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )

class StationRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        # Soft delete by setting archive to True
        instance.archive = True
        instance.updated_by = self.request.user
        instance.save()
