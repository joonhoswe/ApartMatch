# Generated by Django 5.0.6 on 2024-06-09 01:29

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='joinedListing',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=20), blank=True, default=list, size=None),
        ),
    ]
