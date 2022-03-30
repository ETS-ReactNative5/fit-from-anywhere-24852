from rest_framework import viewsets

from .models import Plan
from .serializers import PlanSerializer, GetPlanSerializer


class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()

    def get_serializer_class(self):
        if self.request.method in ("PUT", "POST", "PATCH"):
            return PlanSerializer
        else:
            return GetPlanSerializer
