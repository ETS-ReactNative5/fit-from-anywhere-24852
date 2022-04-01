from django.contrib import admin

from .models import Program, UserProgress, UserPlan

admin.site.register(Program)
admin.site.register(UserProgress)
admin.site.register(UserPlan)
