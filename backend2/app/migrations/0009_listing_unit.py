# Generated by Django 5.0.6 on 2024-06-27 20:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_remove_listing_imageurl_listing_images'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='unit',
            field=models.CharField(default='N/A', max_length=10),
        ),
    ]
