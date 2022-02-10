from django.db import models
from django.conf import settings

from utils.models import BaseModel
from utils import generate_file_name


class WorkoutVideo(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        related_name="user_workout_video",
        on_delete=models.CASCADE,
    )
    video_file = models.FileField(
        upload_to=generate_file_name,
        blank=False,
        null=False,
    )
    description = models.TextField(
        blank=True,
        null=True,
    )
    name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Workout Video"
        verbose_name_plural = "Workout Videos"

    def __unicode__(self):
        return f"{self.name}"

    def __str__(self) -> str:
        return f"{self.name}"
