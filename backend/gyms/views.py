from rest_framework import viewsets

from .models import Gym
from .serializers import GymSerializer, GetGymSerializer


class GymViewSet(viewsets.ModelViewSet):
    queryset = Gym.objects.all()

    def get_serializer_class(self):
        if self.request.method in ("PUT", "POST", "PATCH"):
            return GymSerializer
        else:
            return GetGymSerializer
