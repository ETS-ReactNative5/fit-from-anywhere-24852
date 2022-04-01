from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProgramViewSet, UserProgressViewSet, UserPlanViewSet

app_name = "programs"

router = DefaultRouter()
router.register("program", ProgramViewSet, basename="programs")
router.register("user-progress", UserProgressViewSet, basename="user-progress")
router.register("user-plan", UserPlanViewSet, basename="user-plan")

urlpatterns = [
    path("", include(router.urls)),
]
