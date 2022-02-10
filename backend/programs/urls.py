from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProgramViewSet

app_name = "programs"

router = DefaultRouter()
router.register("program", ProgramViewSet, basename="programs")

urlpatterns = [
    path("", include(router.urls)),
]
