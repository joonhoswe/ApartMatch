from django.db import models
from django.contrib.postgres.fields import ArrayField

class Listing(models.Model):
    #columns of the sqlite(soon to be postgresql database are defined here)
    #CharField(): used for string
    #PositiveIntegerField(): used for int
    owner = models.CharField(max_length=20, default='admin')
    address = models.CharField(max_length=100)
    state = models.CharField(max_length=20)
    zipCode = models.PositiveIntegerField()
    city = models.CharField(max_length=30)
    rent = models.PositiveIntegerField()
    homeType = models.CharField(max_length=20)
    unit = models.CharField(max_length=10, default='N/A', blank=True)
    rooms = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    joinedListing = ArrayField(models.CharField(max_length=20, blank=True), blank=True, default = list)
    emails = ArrayField(models.CharField(max_length=50, blank=True), blank=True, default = list)
    images = ArrayField(models.CharField(max_length=500, blank=True), blank=True, default = list)
    

    def __str__(self):
        return self.address