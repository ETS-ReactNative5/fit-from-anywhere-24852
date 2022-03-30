from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ResourceLibraryViewSet

app_name = "resource-library"

router = DefaultRouter()
router.register(
    "resource-libraries", ResourceLibraryViewSet, basename="resource-libraries"
)

urlpatterns = [
    path("", include(router.urls)),
]
