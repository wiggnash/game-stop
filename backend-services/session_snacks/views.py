from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import SessionSnack
from .serializers import SessionSnackSerializer

class SessionSnackListCreateView(generics.ListCreateAPIView):
    queryset = SessionSnack.objects.all()
    serializer_class = SessionSnackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SessionSnack.objects.filter(archive=False)

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

class SessionSnackRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SessionSnack.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SessionSnackSerializer

    def perform_update(self, serializer):
        serializer.save(
            updated_by=self.request.user
        )

        return Response(serializer.data)

    def perform_destroy(self, instance):
        instance.archive = True
        instance.updated_by = self.request.user
        instance.save()
