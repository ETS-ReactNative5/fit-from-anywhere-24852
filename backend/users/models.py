from pickle import TRUE
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _

from utils import generate_file_name
from utils.models import BaseModel


class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """
    name = models.CharField(
        null=True,
        blank=True,
        max_length=255,
    )
    group = models.ManyToManyField(
        "course.Group",
        blank=True,
        related_name="user_group",
    )


class Profile(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_profile"
    )
    profile_image = models.ImageField(
        upload_to=generate_file_name, null=True, blank=True
    )
    weight = models.PositiveIntegerField(blank=True, null=True)
    _WEIGHT_METRIC = [("KG", "KGs"), ("LB", "LBs")]
    weight_metric = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        choices=_WEIGHT_METRIC,
        default="LB",
    )
    _HEIGHT_METRIC = [("CM", "CMs"), ("FEET", "Feets")]
    height_metric = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        choices=_HEIGHT_METRIC,
        default="CM",
    )
    fitness_goal = models.CharField(max_length=255, blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    _GENDER = [
        ("M", "Male"),
        ("F", "Female"),
        ("O", "Others"),
    ]
    gender = models.CharField(
        choices=_GENDER, default="F", blank=True, null=True, max_length=50
    )
    student_campus_residential_address = models.TextField(
        blank=True,
        null=True,
    )
    is_trainer = models.BooleanField(
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"

    def __unicode__(self):
        return f"{self.user}"

    def __str__(self) -> str:
        return f"{self.user}"
