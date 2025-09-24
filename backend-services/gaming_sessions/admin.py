from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin
from .models import GamingSession

@admin.register(GamingSession)
class GamingSessionAdmin(SimpleHistoryAdmin):
    list_display = ['id', 'user', 'service', 'session_status', 'check_in_time']
    history_list_display = ['session_status', 'total_session_cost', 'check_out_time']
