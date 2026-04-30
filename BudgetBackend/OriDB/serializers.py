# oridb/serializers.py
from rest_framework import serializers
from .models import Record


class RecordSerializer(serializers.ModelSerializer):
    # This will come from queryset annotation (see viewset)
    has_children = serializers.BooleanField(read_only=True)

    class Meta:
        model = Record
        fields = [
            "sys_id",
            "u_sso_id_name",
            "name",
            "parent",          # returns parent sys_id (or null)
            "description",
            "sys_updated_on",
            "has_children",
        ]

class RecordSearchSerializer(serializers.ModelSerializer):
    has_children = serializers.BooleanField(read_only=True)

    parent_sys_id = serializers.CharField(source="parent_id", allow_null=True, read_only=True)

    class Meta:
        model = Record
        fields = ["sys_id", "name", "has_children", "parent_sys_id"] 