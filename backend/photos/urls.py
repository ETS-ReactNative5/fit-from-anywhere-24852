from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import PhotoViewSet

router = DefaultRouter()
router.register("", PhotoViewSet, basename="photos")

app_name = "photos"

urlpatterns = [
    path("photos/", include(router.urls)),
]
