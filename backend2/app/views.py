from django.shortcuts import get_object_or_404

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
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def getListing(request):
    if request.method == 'GET':
        #get all the listings from the database
        listings = Listing.objects.all()
        #serialize the listings
        serializer = ListingSerializer(listings, many=True)
        #return the serialized listings
        return Response(serializer.data)
    
@api_view(['DELETE'])
def deleteListing(request, id):
    listing = get_object_or_404(Listing, id=id)
    if request.method == 'DELETE':
        listing.delete()
        return Response({'message': 'Listing deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
@api_view(['PUT'])
def updateListing(request, id):
    listing = get_object_or_404(Listing, id=id)
    if request.method == 'PUT':
        data = {'rent': request.data.get('rent')}
        serializer = ListingSerializer(listing, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

