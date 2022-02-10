import imp
from rest_framework import viewsets

from .models import Program
from .serializers import ProgramSerializer, GetProgramSerializer


class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()

    def get_serializer_class(self):
        if self.request.method in ("PUT", "POST", "PATCH"):
            return ProgramSerializer
        else:
            return GetProgramSerializer
