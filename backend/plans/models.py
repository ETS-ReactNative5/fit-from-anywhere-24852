from django.db import models

from utils.models import BaseModel


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

    class Meta:
        verbose_name = "Plans"
        verbose_name_plural = "Plans"

    def __str__(self) -> str:
        return f"{self.name}"
