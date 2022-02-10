from django.db import models
from django.conf import settings

from utils.models import BaseModel


class Program(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="user_program",
    )
    name = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "Program"
        verbose_name_plural = "Programs"

    def __unicode__(self):
        return f"{self.user}"

    def __str__(self):
        return f"{self.user}"
