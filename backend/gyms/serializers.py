from rest_framework import serializers

from .models import Gym


class GymSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gym
        fields = "__all__"


class GetGymSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gym
        fields = "__all__"
        depth = 1
