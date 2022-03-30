from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import PlanViewSet

app_name = "plans"

router = DefaultRouter()
router.register("plan", PlanViewSet, basename="plans")

urlpatterns = [
    path("", include(router.urls)),
]
