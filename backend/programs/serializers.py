from rest_framework import serializers
from drf_writable_nested.serializers import WritableNestedModelSerializer

from .models import Program, UserProgress
from plans.serializers import PlanSerializer


class ProgramSerializer(WritableNestedModelSerializer):
    plans = PlanSerializer(many=True)

    class Meta:
        model = Program
        fields = "__all__"


class GetProgramSerializer(serializers.ModelSerializer):
    plans = PlanSerializer(many=True)

    class Meta:
        model = Program
        fields = "__all__"
        depth = 1


# UserProgress serializer
class UserProgressSerializer(WritableNestedModelSerializer):
    class Meta:
        model = UserProgress
        fields = "__all__"


class GetUserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = "__all__"
        depth = 1
