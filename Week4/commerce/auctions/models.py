from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Listing(models.Model):
    #id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=256)
    starting_bid = models.IntegerField()
    photo = models.URLField(blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, related_name="listings", default="")
    active = models.BooleanField(default=True)
    #related name allows to search for all listings for a given user

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, related_name="watchlists", default="")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="watchlists", default="")

class Bid(models.Model):
    amount = models.IntegerField()
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bids", default="")
    #specify that listing field is a foreign key, meaning it referes to another object (which is Listings)
    #if a listing is deleted, delete all the bids tied to that listing
    #related name gives us a way to search for all bids for a given listing
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, related_name="bids", default="")
    #this field is related to User field
    #blank= False, because a Bid cannot have no user
    #related name allows us to pull all bids from a given user

class Comment(models.Model):
    comment = models.CharField(max_length=128)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments_via_user", default="")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments_via_listing", default="")

