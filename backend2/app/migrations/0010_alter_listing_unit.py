# Generated by Django 5.0.6 on 2024-06-29 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_listing_unit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='unit',
            field=models.CharField(blank=True, default='N/A', max_length=10),
        ),
    ]
