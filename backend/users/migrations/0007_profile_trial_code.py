# Generated by Django 2.2.27 on 2022-04-04 15:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_profile_height'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='trial_code',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]