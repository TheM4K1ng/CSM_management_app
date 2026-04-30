from rest_framework import serializers
from .models import CustomerMeeting, Record

class CustomerMeetingSerializer(serializers.ModelSerializer):
    record = serializers.SlugRelatedField(
        slug_field="sys_id",
        queryset=Record.objects.all()
    )

    class Meta:
        model = CustomerMeeting
        fields = ["id", "record", "customer_name", "date", "summary", "created_at"]
        read_only_fields = ["id", "created_at"] 