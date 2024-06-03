from django.shortcuts import render

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
#imported from models.py
from .models import Listing
#imported from serializers.py
from .serializers import ListingSerializer

#this function is an api view
@api_view(['POST'])
def createListing(request):
    if request.method == 'POST':
        #if method request is POST then create a ListingSerializer instance 
        #with the data that was entered from the website
        serializer = ListingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            #saves the serializer into the database 
            #returns HTTP status code 201 (successful)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        #if serializer isn't valid then return unsuccessful HTTP request
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        