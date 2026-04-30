from rest_framework import viewsets
from rest_framework.response import Response

from .models import CustomerMeeting
from .serializers_meetings import CustomerMeetingSerializer


class CustomerMeetingViewSet(viewsets.ModelViewSet):
    queryset = CustomerMeeting.objects.all().order_by("-date", "-id")
    serializer_class = CustomerMeetingSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        record = self.request.query_params.get("record")
        if record:
            qs = qs.filter(record_id=record)  #Record.sys_id
        return qs