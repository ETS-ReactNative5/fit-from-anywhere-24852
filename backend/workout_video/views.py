from rest_framework import viewsets

from .models import WorkoutVideo
from .serializers import WorkoutVideoSerializer, GetWorkoutVideoSerializer


class WorkoutVideoViewSet(viewsets.ModelViewSet):
    queryset = WorkoutVideo.objects.all()

    def get_serializer_class(self):
        if self.request.method in ("PUT", "POST", "PATCH"):
            return WorkoutVideoSerializer
        else:
            return GetWorkoutVideoSerializer
