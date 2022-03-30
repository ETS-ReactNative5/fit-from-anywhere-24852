from rest_framework import viewsets

from .models import ResourceLibrary
from .serializers import ResourceLibrarySerializer


class ResourceLibraryViewSet(viewsets.ModelViewSet):
    queryset = ResourceLibrary.objects.all()
    serializer_class = ResourceLibrarySerializer
