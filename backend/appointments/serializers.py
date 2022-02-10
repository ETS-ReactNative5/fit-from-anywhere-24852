from rest_framework import serializers

from .models import Appointment, AvailableDay


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"


class GetAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"
        depth = 1


class AvailableDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableDay
        fields = "__all__"


class GetAvailableDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableDay
        fields = "__all__"
        depth = 1
