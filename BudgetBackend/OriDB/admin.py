from django.contrib import admin
from .models import Record

@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    list_display = ("sys_id", "name", "parent", "sys_updated_on")
    search_fields = ("sys_id", "name", "u_sso_id_name")
    list_filter = ("sys_updated_on",)