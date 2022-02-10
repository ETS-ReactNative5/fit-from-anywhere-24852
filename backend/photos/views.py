from rest_framework import viewsets, parsers, status
from rest_framework.response import Response

from .models import Photos
from .serializers import PhotosSerializer


class PhotoViewSet(viewsets.ModelViewSet):
    serializer_class = PhotosSerializer
    queryset = Photos.objects.all()
    parser_classes = (
        parsers.MultiPartParser,
        parsers.FormParser,
    )
    # swagger_schema = None
    filterset_fields = ["user__id"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        serializer.save()

    def get_parsers(self):
        if getattr(self, "swagger_fake_view", False):
            return []

        return super().get_parsers()
