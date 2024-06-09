# Generated by Django 5.0.6 on 2024-06-09 01:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner', models.CharField(default='admin', max_length=20)),
                ('address', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=10)),
                ('zipCode', models.PositiveIntegerField()),
                ('city', models.CharField(max_length=30)),
                ('rent', models.PositiveIntegerField()),
                ('homeType', models.CharField(max_length=20)),
                ('rooms', models.PositiveIntegerField()),
                ('bathrooms', models.PositiveIntegerField()),
                ('gender', models.CharField(max_length=10)),
            ],
        ),
    ]
