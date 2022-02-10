from rest_framework import viewsets

from .models import Appointment, AvailableDay
from .serializers import (
    AppointmentSerializer,
    GetAppointmentSerializer,
    AvailableDaySerializer,
    GetAvailableDaySerializer,
)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()

    filterset_fields = {
        "user__id": ["exact"],
        "booked_date": ["gte", "lte", "exact", "gt", "lt", "range"],
        "booked_time": ["gte", "lte", "exact", "gt", "lt", "range"],
        "trainer__id": ["exact"],
    }

    def get_serializer_class(self):
        if self.request.method in ("PUT", "POST", "PATCH"):
            return AppointmentSerializer
        else:
            return GetAppointmentSerializer


class AvailableDayViewSet(viewsets.ModelViewSet):
    queryset = AvailableDay.objects.all()

    filterset_fields = {
        "user__id": ["exact"],
        "from_date_time": ["gte", "lte", "exact", "gt", "lt", "range"],
        "till_date_time": ["gte", "lte", "exact", "gt", "lt", "range"],
    }

    def get_serializer_class(self):
        if self.request.method in ("PUT", "POST", "PATCH"):
            return AvailableDaySerializer
        else:
            return GetAvailableDaySerializer
