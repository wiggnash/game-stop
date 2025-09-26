from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import GamingSession
from .serializers import GamingSessionSerializer, GamingSessionActiveDashboardSerializer, GamingSessionDetailSerializer

class GamingSessionListCreateView(generics.ListCreateAPIView):
    queryset = GamingSession.objects.all()
    serializer_class = GamingSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GamingSession.objects.filter(archive=False)

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )

        return Response(serializer.data)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

class GamingSessionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GamingSession.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = GamingSessionSerializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return GamingSessionDetailSerializer
        return GamingSessionSerializer

    def perform_update(self, serializer):
        serializer.save(
            updated_by=self.request.user
        )

        return Response(serializer.data)

    def perform_destroy(self, instance):
        instance.archive = True
        instance.updated_by = self.request.user
        instance.save()

class GamingSessionListActiveView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GamingSessionActiveDashboardSerializer

    def get_queryset(self):
        return GamingSession.objects.filter(session_status='ACTIVE', archive=False)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GamingSessionListPastView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GamingSessionActiveDashboardSerializer

    def get_queryset(self):
        return GamingSession.objects.filter(session_status='COMPLETED', archive=False)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
