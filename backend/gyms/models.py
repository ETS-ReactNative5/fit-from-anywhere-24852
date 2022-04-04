from django.db import models
from django.conf import settings

from utils.models import BaseModel
from utils import generate_file_name
from programs.models import Program


class Gym(BaseModel):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="user_gym",
    )
    name = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )
    program = models.ForeignKey(
        Program,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="gym_program",
    )
    gym_image = models.ImageField(
        upload_to=generate_file_name,
        null=True,
        blank=True,
    )
    trial_code = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Gym"
        verbose_name_plural = "Gyms"

    def __str__(self):
        return f"{self.owner}"
