from tabnanny import verbose
from django.contrib import admin

from .models import Program, UserProgress, UserPlan
from plans.models import Plan
from workout_plans.models import WorkoutPlan


class WorkoutPlansInline(admin.TabularInline):
    model = Program.workout_plans.through
    verbose_name = "Workout Plans"
    verbose_name_plural = "Workout Plans"


class PlansInline(admin.TabularInline):
    model = Program.plans.through
    verbose_name = "Plans"
    verbose_name_plural = "Plans"


class PlanAdmin(admin.ModelAdmin):
    inlines = [
        PlansInline,
    ]


class WorkoutPlanAdmin(admin.ModelAdmin):
    inlines = [
        WorkoutPlansInline,
    ]


class ProgramAdmin(admin.ModelAdmin):
    inlines = [
        PlansInline,
        WorkoutPlansInline,
    ]
    exclude = (
        "plans",
        "workout_plans",
    )


admin.site.register(Program, ProgramAdmin)
admin.site.register(UserProgress)
admin.site.register(UserPlan)
