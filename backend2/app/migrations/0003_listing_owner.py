# Generated by Django 5.0.6 on 2024-06-04 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_rename_numbaths_listing_bathrooms_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='owner',
            field=models.CharField(default='admin', max_length=10),
        ),
    ]
