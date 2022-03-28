# Generated by Django 2.2.27 on 2022-03-28 07:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workout_plans', '0002_auto_20220325_1230'),
    ]

    operations = [
        migrations.AddField(
            model_name='workoutplan',
            name='plan_day',
            field=models.PositiveIntegerField(blank=True, help_text='Day of this workout according to number of plan days.', null=True),
        ),
    ]
