from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import UserRole
from .serializers import UserRoleSerializer

class UserRoleListCreateView(generics.ListCreateAPIView):
    queryset = UserRole.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserRoleSerializer

    def get_queryset(self):
        return UserRole.objects.filter(archive=False)

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user
        )

        return Response(serializer.data)

class UserRoleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserRole.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserRoleSerializer

    def perform_update(self, serializer):
        serializer.save(
            updated_by=self.request.user
        )

        return Response(serializer.data)

    def perform_destroy(self, instance):
        instance.archive = True
        instance.updated_by = self.request.user
        instance.save()
