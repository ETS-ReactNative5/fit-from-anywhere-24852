from rest_framework import viewsets

from .models import WorkoutPlan
from .serializers import WorkoutPlanSerializer, GetWorkoutPlanSerializer


class WorkoutPlanViewSet(viewsets.ModelViewSet):
    queryset = WorkoutPlan.objects.all()
    filterset_fields = {
        "workout__id": ["exact"],
        "plan__id": ["exact"],
        "plan_day": ["gte", "lte", "exact", "gt", "lt", "range"],
    }

    def get_serializer_class(self):
        if self.request.method in ("PUT", "POST", "PATCH"):
            return WorkoutPlanSerializer
        else:
            return GetWorkoutPlanSerializer
