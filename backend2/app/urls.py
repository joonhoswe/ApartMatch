from django.urls import path
from .views import createListing
from app import views

urlpatterns=[
    path('app/',createListing,name='createListing')
]