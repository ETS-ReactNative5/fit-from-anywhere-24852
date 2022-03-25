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

    class Meta:
        verbose_name = "Workout Plans"
        verbose_name_plural = "Workout Plans"

    def __str__(self) -> str:
        return f"Plan: {self.plan} | Workout: {self.workout}"
