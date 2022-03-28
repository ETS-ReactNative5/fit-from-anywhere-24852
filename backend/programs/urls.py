from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProgramViewSet, UserProgressViewSet

app_name = "programs"

router = DefaultRouter()
router.register("program", ProgramViewSet, basename="programs")
router.register("user-progress", UserProgressViewSet, basename="user-progress")

urlpatterns = [
    path("", include(router.urls)),
]
