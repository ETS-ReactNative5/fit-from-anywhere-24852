from django.db import models
from django.conf import settings

from utils.models import BaseModel
from utils import generate_file_name


class ResourceLibrary(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="user_resource_library",
    )
    title = models.CharField(
        blank=True,
        null=True,
        max_length=255,
    )
    description = models.TextField(
        blank=True,
        null=True,
    )
    video = models.FileField(
        upload_to=generate_file_name,
        blank=True,
        null=True,
    )
    document = models.FileField(
        upload_to=generate_file_name,
        blank=True,
        null=True,
    )
    image = models.ImageField(
        upload_to=generate_file_name,
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Resource Library"
        verbose_name_plural = "Resource Library"

    def __unicode__(self):
        return f"{self.user}"

    def __str__(self):
        return f"{self.business}"
