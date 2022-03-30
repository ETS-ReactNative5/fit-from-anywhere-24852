from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import WorkoutPlanViewSet

app_name = "workout-plans"

router = DefaultRouter()
router.register("workout-plans", WorkoutPlanViewSet, basename="workout-plans")

urlpatterns = [
    path("", include(router.urls)),
]
