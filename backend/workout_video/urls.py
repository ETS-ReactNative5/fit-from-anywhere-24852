from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import WorkoutVideoViewSet

app_name = "workout-videos"

router = DefaultRouter()
router.register("workout-video", WorkoutVideoViewSet, basename="workout-videos")

urlpatterns = [
    path("", include(router.urls)),
]
