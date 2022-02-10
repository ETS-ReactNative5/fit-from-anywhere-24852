from rest_framework import serializers

from .models import WorkoutVideo


class WorkoutVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutVideo
        fields = "__all__"


class GetWorkoutVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutVideo
        fields = "__all__"
        depth = 1
