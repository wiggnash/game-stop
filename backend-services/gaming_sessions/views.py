from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta

# Models Import
from .models import GamingSession
from durations.models import Duration
from stations.models import Station

# Utils Import
from .utils import (
    calculate_checkout_time,
    calculate_gaming_cost,
)

# Serializer Import
from .serializers import (
    GamingSessionSerializer,
    GamingSessionActiveDashboardSerializer,
    GamingSessionDetailSerializer,
    DurationDropdownSerializer,
    ActiveStatationDropDownSerializer
)

class GamingSessionListCreateView(generics.ListCreateAPIView):
    queryset = GamingSession.objects.all()
    serializer_class = GamingSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GamingSession.objects.filter(archive=False)

    def perform_create(self, serializer):
        # Get the necessary data
        check_in_time = serializer.validated_data.get('check_in_time')
        duration = serializer.validated_data.get('duration')
        station = serializer.validated_data.get('station')

        # Calculate checkout time based on duration
        check_out_time = calculate_checkout_time(check_in_time, duration)

        # Calculate gaming cost based on station's service hourly rate and duration
        calculated_gaming_cost = calculate_gaming_cost(station, duration)

        # Total session cost (for now same as gaming cost, can add extras later)
        total_session_cost = calculated_gaming_cost

        # Save the gaming session with calculated values
        gaming_session = serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user,
            check_out_time=check_out_time,
            calculated_gaming_cost=calculated_gaming_cost,
            total_session_cost=total_session_cost
        )

        # Mark the station as occupied
        if gaming_session and gaming_session.station:
            gaming_session.station.is_occupied = True
            gaming_session.station.save()

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
        instance = serializer.instance

        # If duration or check_in_time is being updated, recalculate checkout time and costs
        if 'duration' in serializer.validated_data and instance.duration != serializer.validated_data['duration']:
            check_in_time = serializer.validated_data.get('check_in_time', instance.check_in_time)
            duration = serializer.validated_data.get('duration', instance.duration)
            station = serializer.validated_data.get('station', instance.station)

            # Recalculate checkout time
            check_out_time = calculate_checkout_time(check_in_time, duration)

            # Recalculate gaming cost
            calculated_gaming_cost = calculate_gaming_cost(station, duration)
            total_session_cost += calculated_gaming_cost

            serializer.save(
                updated_by=self.request.user,
                check_out_time=check_out_time,
                calculated_gaming_cost=calculated_gaming_cost,
                total_session_cost=total_session_cost
            )
        else:
            serializer.save(updated_by=self.request.user)

    def perform_destroy(self, instance):
        # When archiving a session, mark station as available
        if instance.station:
            instance.station.is_occupied = False
            instance.station.save()

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

class GamingSessionListDropDownView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        active_stations = Station.objects.filter(is_active=True)
        durations = Duration.objects.filter(archive=False)
        number_of_players = [1,2,3,4]

        # Serialize the data
        durations_serializer = DurationDropdownSerializer(durations, many=True)
        stations_serializer = ActiveStatationDropDownSerializer(active_stations, many=True)

        reponse = {
            'active_stations': stations_serializer.data,
            'durations': durations_serializer.data,
            'number_of_players': number_of_players
        }

        return Response(reponse, status=status.HTTP_200_OK)
