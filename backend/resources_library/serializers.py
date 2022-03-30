from rest_framework import serializers

from .models import ResourceLibrary


class ResourceLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceLibrary
        fields = "__all__"
