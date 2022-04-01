from django.db import models
from django.conf import settings

from utils.models import BaseModel
from plans.models import Plan
from workout_plans.models import WorkoutPlan
from workouts.models import Workout


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
    plans = models.ManyToManyField(
        Plan,
        blank=True,
        related_name="program_plans",
    )

    class Meta:
        verbose_name = "Program"
        verbose_name_plural = "Programs"

    def __unicode__(self):
        return f"{self.name}"

    def __str__(self):
        return f"{self.name}"


class UserProgress(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="user_progress",
    )
    program = models.ForeignKey(
        Program,
        blank=True,
        null=True,
        related_name="user_progress_program",
        on_delete=models.CASCADE,
    )
    workout = models.ForeignKey(
        Workout,
        blank=True,
        on_delete=models.CASCADE,
        null=True,
        related_name="user_progress_workout",
    )
    workout_plan = models.ForeignKey(
        WorkoutPlan,
        blank=True,
        null=True,
        related_name="user_progress_workout_plan",
        on_delete=models.CASCADE,
    )
    set = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="How many sets of this workout has been performed?",
    )
    repetition = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="How many repetitions of this workout has been performed?",
    )

    class Meta:
        verbose_name = "User Progress"
        verbose_name_plural = "User Progress"

    def __str__(self):
        return f"{self.user}"


class UserPlan(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="user_plan",
    )
    plan = models.ForeignKey(
        Plan,
        blank=True,
        null=True,
        related_name="user_plan_plan",
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = "User Plan"
        verbose_name_plural = "User Plan"

    def __str__(self):
        return f"{self.user}"
