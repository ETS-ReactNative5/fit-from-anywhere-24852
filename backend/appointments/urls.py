from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AppointmentViewSet, AvailableDayViewSet

app_name = "appointments"

router = DefaultRouter()
router.register("appointment", AppointmentViewSet, basename="appointment")
router.register("available-day", AvailableDayViewSet, basename="available-day")

urlpatterns = [
    path("", include(router.urls)),
]
