from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import RecordViewSet
from .views_meetings import CustomerMeetingViewSet

router = DefaultRouter()
router.register(r"records", RecordViewSet, basename="record")
router.register(r"meetings", CustomerMeetingViewSet, basename="meeting")

urlpatterns = [
    path("", include(router.urls)),
]