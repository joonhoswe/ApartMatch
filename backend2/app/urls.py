from django.urls import path
from .views import createListing
from app import views

urlpatterns=[
    #arguments: 1. url pattern, 2. function to be called (from views.py)
    #3. name which can be used to reference
    path('app/', createListing, name='createListing')
]