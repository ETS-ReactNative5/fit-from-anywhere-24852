from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import CustomTextViewSet, HomePageViewSet

from home.api.v1.viewsets import (
    HomePageViewSet,
    CustomTextViewSet,
    UserProfileAPIView,
    UserProfileViewSet,
)

router = DefaultRouter()
router.register("customtext", CustomTextViewSet)
router.register("homepage", HomePageViewSet)
router.register("profile", UserProfileViewSet, basename="profile")

urlpatterns = [
    path("", include(router.urls)),
    path("user-profile/", UserProfileAPIView.as_view()),
]
