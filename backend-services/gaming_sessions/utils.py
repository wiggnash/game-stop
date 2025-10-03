from datetime import timedelta
from django.utils import timezone
from decimal import Decimal
from service_types.models import ServiceType
from durations.models import Duration
from rest_framework.exceptions import ValidationError

from service_prices.models import ServicePrice

def calculate_times(duration_id):
    """Calculate Check In time and Calculate Checkout time"""
    check_in_time = timezone.now()
    try:
        duration = Duration.objects.get(id=duration_id)
    except Duration.DoesNotExist:
        return ValidationError("Duration does not exists")

    if duration.type == 'MINUTE':
        check_out_time = check_in_time + timedelta(minutes=duration.duration)
    elif duration.type == 'HOUR':
        check_out_time = check_in_time + timedelta(hours=duration.duration)

    return check_in_time, check_out_time

def calculate_gaming_cost(
    service_type_id,
    game_type_id,
    duration_id,
    number_of_players
):
    """Calculate gaming cost"""
    try:
        # Get the service type to check its name
        service_type = ServiceType.objects.get(id=service_type_id)

        # Build the filter dynamically
        filters = {
            'service_type': service_type_id,
            'game_type': game_type_id,
            'duration': duration_id,
        }

        # Add player_count filter only if service type is "Console" (case-insensitive)
        if service_type.name.upper() == 'CONSOLE':
            filters['player_count'] = number_of_players

        # Query with the appropriate filters
        service_price = ServicePrice.objects.get(**filters)
        return service_price.price

    except ServiceType.DoesNotExist:
        raise ValidationError(f"Service type with id {service_type_id} does not exist")
    except ServicePrice.DoesNotExist:
        raise ValidationError(
            f"No price configured for the selected options: "
            f"service_type={service_type.name}, game_type={game_type_id}, "
            f"duration={duration_id}" +
            (f", player_count={number_of_players}" if service_type.name.upper() == 'CONSOLE' else "")
        )
