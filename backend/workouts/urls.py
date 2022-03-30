from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import Workout, WorkoutViewSet

app_name = "workouts"

router = DefaultRouter()
router.register("workouts", WorkoutViewSet, basename="workouts")

urlpatterns = [
    path("", include(router.urls)),
]
