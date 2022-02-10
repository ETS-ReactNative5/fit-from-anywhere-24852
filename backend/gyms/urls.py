from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import GymViewSet

app_name = "gyms"

router = DefaultRouter()
router.register("gym", GymViewSet, basename="gyms")

urlpatterns = [
    path("", include(router.urls)),
]
