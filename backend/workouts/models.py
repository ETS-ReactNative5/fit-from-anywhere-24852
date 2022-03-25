from django.db import models

from utils.models import BaseModel


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

    class Meta:
        verbose_name = "Workouts"
        verbose_name_plural = "Workouts"

    def __str__(self) -> str:
        return f"{self.name}"
