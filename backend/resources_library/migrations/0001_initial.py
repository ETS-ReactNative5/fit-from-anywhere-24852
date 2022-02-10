# Generated by Django 2.2.26 on 2022-02-10 11:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import utils
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ResourceLibrary',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('video', models.FileField(blank=True, null=True, upload_to=utils.generate_file_name)),
                ('document', models.FileField(blank=True, null=True, upload_to=utils.generate_file_name)),
                ('image', models.ImageField(blank=True, null=True, upload_to=utils.generate_file_name)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_resource_library', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Resource Library',
                'verbose_name_plural': 'Resource Library',
            },
        ),
    ]