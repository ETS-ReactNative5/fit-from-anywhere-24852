from rest_framework import serializers
from drf_writable_nested.serializers import WritableNestedModelSerializer

from .models import Gym


class GymSerializer(WritableNestedModelSerializer):
    class Meta:
        model = Gym
        fields = "__all__"


class GetGymSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gym
        fields = "__all__"
        depth = 1
