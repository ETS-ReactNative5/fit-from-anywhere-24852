import imp
from rest_framework import viewsets

from .models import Program, UserProgress
from .serializers import (
    ProgramSerializer,
    GetProgramSerializer,
    UserProgressSerializer,
    GetUserProgressSerializer,
)


class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()

    def get_serializer_class(self):
        if self.request.method in ("PUT", "POST", "PATCH"):
            return ProgramSerializer
        else:
            return GetProgramSerializer


class UserProgressViewSet(viewsets.ModelViewSet):
    queryset = UserProgress.objects.all()
    filterset_fields = {
        "user__id": ["exact"],
        "set": ["gte", "lte", "exact", "gt", "lt", "range"],
        "repetition": ["gte", "lte", "exact", "gt", "lt", "range"],
        "program__id": ["exact"],
        "workout_plan__id": ["exact"],
    }

    def get_serializer_class(self):
        if self.request.method in ("PUT", "POST", "PATCH"):
            return UserProgressSerializer
        else:
            return GetUserProgressSerializer
