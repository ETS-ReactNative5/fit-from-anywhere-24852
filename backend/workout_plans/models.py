from django.db import models

from utils.models import BaseModel
from plans.models import Plan
from workouts.models import Workout


class WorkoutPlan(BaseModel):
    workout = models.ForeignKey(
        Workout,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="workout_plan_workout",
    )
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="workout_plan_plan",
    )
    plan_day = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Day of this workout according to number of plan days.",
    )
    order_number = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Order number of the exercise.",
    )
    sets = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="How many sets of this workout to be performed?",
    )
    repetitions = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="How many repetitions of this workout to be performed?",
    )
    rest_period = models.DurationField(
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Workout Plans"
        verbose_name_plural = "Workout Plans"

    def __str__(self) -> str:
        return f"Plan: {self.plan} | Workout: {self.workout}"
