from rest_framework import serializers

from .models import WorkoutPlan


class WorkoutPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutPlan
        fields = "__all__"


class GetWorkoutPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutPlan
        fields = "__all__"
        depth = 1
