from django.db import models

class Listing(models.Model):
    #columns of the sqlite(soon to be postgresql database are defined here)
    #CharField(): used for string
    #PositiveIntegerField(): used for int
    address = models.CharField(max_length=100)
    state = models.CharField(max_length=10)
    zipCode = models.PositiveIntegerField()
    city = models.CharField(max_length=30)
    rent = models.PositiveIntegerField()
    homeType = models.CharField(max_length=20)
    numRooms = models.PositiveIntegerField()
    numBaths = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)

    def __str__(self):
        return self.address