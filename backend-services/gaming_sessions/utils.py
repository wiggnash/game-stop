from datetime import timedelta
from decimal import Decimal

def calculate_checkout_time(check_in_time, duration):
    """Calculate checkout time based on check-in time and duration"""
    if duration.type == 'MINUTE':
        return check_in_time + timedelta(minutes=duration.duration)
    elif duration.type == 'HOUR':
        return check_in_time + timedelta(hours=duration.duration)
    return check_in_time

def calculate_gaming_cost(station, duration):
    """Calculate gaming cost based on station's hourly rate and duration"""
    hourly_rate = station.gaming_service.hourly_rate

    if duration.type == 'MINUTE':
        # Convert minutes to hours for calculation
        hours = Decimal(str(duration.duration / 60))
    elif duration.type == 'HOUR':
        hours = Decimal(str(duration.duration))
    else:
        hours = Decimal('0')

    # Calculate cost
    cost = hourly_rate * hours
    return round(cost, 2)
