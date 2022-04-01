from rest_framework import viewsets

from .models import Program, UserPlan, UserProgress
from .serializers import (
    ProgramSerializer,
    GetProgramSerializer,
    UserProgressSerializer,
    GetUserProgressSerializer,
    UserPlanSerializer,
    GetUserPlanSerializer,
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
        "workout__id": ["exact"],
    }

    def get_serializer_class(self):
        if self.request.method in ("PUT", "POST", "PATCH"):
            return UserProgressSerializer
        else:
            return GetUserProgressSerializer


class UserPlanViewSet(viewsets.ModelViewSet):
    queryset = UserPlan.objects.all()
    filterset_fields = {
        "user__id": ["exact"],
        "plan__id": ["exact"],
        "created_at": ["gte", "lte", "exact", "gt", "lt", "range"],
    }

    def get_serializer_class(self):
        if self.request.method in ("PUT", "POST", "PATCH"):
            return UserPlanSerializer
        else:
            return GetUserPlanSerializer
