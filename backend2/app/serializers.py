from rest_framework import serializers
from .models import Listing

#purpose: serializers in django's rest framework converts data
#types from foreign data types into python data types
class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        #sets model to the component from models.py
        model = Listing
        #includes all fields of model
        fields = '__all__' 
