from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Listings(models.Model):
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=256)
    starting_bid = models.IntegerField()
    photo = models.URLField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    #related name allows to search for all listings for a given user

class Bids(models.Model):
    amount = models.IntegerField()
    listing = models.ForeignKey(Listings, on_delete=models.CASCADE, related_name="bids_via_listing")
    #specify that listing field is a foreign key, meaning it referes to another object (which is Listings)
    #if a listing is deleted, delete all the bids tied to that listing
    #related name gives us a way to search for all bids for a given listing
    user = models.ManyToManyField(User, blank=False, related_name="bids_via_user")
    #specify that bidder field has many to many relationship with users
    #this field is related to User field
    #blank= False, because a Bid cannot have no user
    #related name allows us to pull all bids from a given user

class Comments(models.Model):
    comment = models.CharField(max_length=128)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments_via_user")
    listing = models.ForeignKey(Listings, on_delete=models.CASCADE, related_name="comments_via_listing")

