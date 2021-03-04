from django.contrib import admin
from .models import (
    Recording,
    Event,
    Subscription,
    Course,
    Group,
    Module,
    SubscriptionType,
    Enrollment,
    Category,
)

admin.site.register(Subscription)
admin.site.register(Enrollment)
admin.site.register(Recording)
admin.site.register(Event)
admin.site.register(Module)
admin.site.register(SubscriptionType)
admin.site.register(Group)
admin.site.register(Course)
admin.site.register(Category)

# Register your models here.
