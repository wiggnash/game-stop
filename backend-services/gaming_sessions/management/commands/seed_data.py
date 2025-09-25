from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from gaming_services.models import Station, GamingService
from gaming_sessions.models import GamingSession
from django.utils import timezone
import random


class Command(BaseCommand):
    help = "Seed database with test data for development"

    def handle(self, *args, **options):
        # 1. Create superuser
        if not User.objects.filter(username="wiggnash").exists():
            User.objects.create_superuser("wiggnash", "vigneshwardeivasigamani@gmail.com", "admin123")
            self.stdout.write(self.style.SUCCESS("Superuser 'wiggnash' created."))

        # 2. Create test users
        users = []
        for i in range(1, 6):
            username = f"user{i}"
            user, created = User.objects.get_or_create(username=username)
            if created:
                user.set_password("password123")
                user.save()
                self.stdout.write(self.style.SUCCESS(f"User {username} created."))
            users.append(user)

        # 3. Create gaming services
        service_types = ["PS4", "PS5", "PC", "VR", "DRIVING"]
        services = []
        for service_type in service_types:
            service, created = GamingService.objects.get_or_create(
                service_type=service_type,
                defaults={
                    "hourly_rate": random.randint(100, 300),
                    "description": f"Description for {service_type}",
                    "created_by": users[0],
                    "updated_by": users[0],
                }
            )
            services.append(service)
            if created:
                self.stdout.write(self.style.SUCCESS(f"GamingService '{service_type}' created."))

        # 4. Create stations linked to random gaming services
        station_names = ["Station 1", "Station 2", "Station 3", "Station 4", "Station 5"]
        stations = []
        for name in station_names:
            service = random.choice(services)
            station, created = Station.objects.get_or_create(
                name=name,
                defaults={
                    "gaming_service": service,
                    "description": f"{name} description",
                    "created_by": users[0],
                    "updated_by": users[0],
                }
            )
            stations.append(station)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Station '{name}' created with service '{service.service_type}'."))

        # 5. Create gaming sessions
        for i in range(1, 11):
            user = random.choice(users[1:])  # skip superuser
            station = random.choice(stations)
            duration_hours = random.randint(1, 5)
            check_in = timezone.now() - timezone.timedelta(hours=duration_hours)
            check_out = timezone.now()
            cost = duration_hours * float(station.gaming_service.hourly_rate)

            session = GamingSession.objects.create(
                created_by=user,
                updated_by=user,
                station=station,
                user=user,
                check_in_time=check_in,
                check_out_time=check_out,
                calculated_gaming_cost=cost,
                total_session_cost=cost,
                session_status="COMPLETED",
                is_walk_in_customer=bool(random.getrandbits(1)),
                notes=f"Test session {i}",
            )
            self.stdout.write(self.style.SUCCESS(f"GamingSession {session.id} created for {user.username}."))

        self.stdout.write(self.style.SUCCESS("✅ Seeding complete!"))
