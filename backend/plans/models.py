from django.db import models

from utils.models import BaseModel
from utils import generate_file_name


class Plan(BaseModel):
    name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    description = models.TextField(
        blank=True,
        null=True,
    )
    days = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Number of days for this plan.",
    )
    image = models.ImageField(
        upload_to=generate_file_name,
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "Plans"
        verbose_name_plural = "Plans"

    def __str__(self) -> str:
        return f"{self.name}"
