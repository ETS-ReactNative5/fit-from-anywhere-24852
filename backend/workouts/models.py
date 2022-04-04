from django.db import models

from utils.models import BaseModel
from utils import generate_file_name


class Workout(BaseModel):
    name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    description = models.TextField(
        blank=True,
        null=True,
    )
    video = models.FileField(
        upload_to=generate_file_name,
        null=True,
        blank=True,
    )
    video_url = models.URLField(
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Workouts"
        verbose_name_plural = "Workouts"

    def __str__(self) -> str:
        return f"{self.name}"
