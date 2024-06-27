# Generated by Django 5.0.6 on 2024-06-26 19:19

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_alter_listing_imageurl'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listing',
            name='imageUrl',
        ),
        migrations.AddField(
            model_name='listing',
            name='images',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=500), blank=True, default=list, size=None),
        ),
    ]
