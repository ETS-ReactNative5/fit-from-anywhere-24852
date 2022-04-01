# Generated by Django 2.2.27 on 2022-04-01 10:46

from django.db import migrations, models
import utils


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0002_plan_days'),
    ]

    operations = [
        migrations.AddField(
            model_name='plan',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=utils.generate_file_name),
        ),
    ]
