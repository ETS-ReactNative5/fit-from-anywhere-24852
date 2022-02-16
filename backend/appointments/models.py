from django.db import models
from django.conf import settings

from utils.models import BaseModel


class Appointment(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="user_appointment",
    )
    booked_date = models.DateField(
        blank=True,
        null=True,
    )
    booked_time = models.TimeField(
        blank=True,
        null=True,
    )
    trainer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="tainer_booked",
    )
    apointment_type = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    status = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    zoom_link = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"

    def __unicode__(self):
        return f"{self.user}"

    def __str__(self):
        return f"{self.user}"


class AvailableDay(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="user_available_day",
    )
    from_date_time = models.DateTimeField(
        blank=True,
        null=True,
    )
    till_date_time = models.DateTimeField(
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Available Day"
        verbose_name_plural = "Available Day"

    def __unicode__(self):
        return f"{self.user}"

    def __str__(self):
        return f"{self.user}"
