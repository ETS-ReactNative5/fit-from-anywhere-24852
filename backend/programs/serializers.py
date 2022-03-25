from rest_framework import serializers
from drf_writable_nested.serializers import WritableNestedModelSerializer

from .models import Program
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
