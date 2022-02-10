from django.conf import settings
from django.db import models

from utils import generate_file_name
from utils.models import BaseModel


class Gallery(BaseModel):
    image = models.ImageField(upload_to=generate_file_name)

    class Meta:
        verbose_name = "Gallery"
        verbose_name_plural = "Gallery"


class Photos(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="user_photos",
    )
    images = models.ManyToManyField(Gallery, related_name="images")

    class Meta:
        verbose_name = "Photos"
        verbose_name_plural = "Photos"

    def __unicode__(self):
        return f"{self.user}"

    def __str__(self):
        return f"{self.user}"
