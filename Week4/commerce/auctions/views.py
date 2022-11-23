from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.core.exceptions import ObjectDoesNotExist

from .models import User, Listing, Bid, Comment, Watchlist

class AddWatchlist(forms.Form):
    Add_to_Watchlist = forms.BooleanField()
class RemoveWatchlist(forms.Form):
    Remove_from_Watchlist = forms.BooleanField()
class BiddingForm(forms.Form):
    Enter_Bid = forms.IntegerField(error_messages={'required': 'New bid must be greater than current bid'})
class Create(forms.ModelForm):
    class Meta:
        model = Listing
        fields = '__all__'


def watchlist(request):
    return render(request, "auctions/watchlist.html", {
        "watchlist": Watchlist.objects.all()
    })

def create(request):
    if request.method == "POST":
        form = Create(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, "auctions/create.html", {
                "form":form
                #returns the form with the pre-populated data
            })
    return render(request, "auctions/create.html", {
        "form":Create
    })

def listing(request, listing_id):
    #page for each listing, linked to listing ID
    listing = Listing.objects.get(id = listing_id)
    #stores all info about a listing by pulling from table with the given ID
    if request.method == "POST":
        add_form = AddWatchlist(request.POST)
        remove_form = RemoveWatchlist(request.POST)
        new_bid = BiddingForm(request.POST)
        if add_form.is_valid():
            f = Watchlist(listing = listing, user=request.user, watchlist_bool=True)
            f.save()
            #save new data row into Watchlist model with listing, user, and watchlist boolean on
        if remove_form.is_valid():
            f = Watchlist.objects.filter(listing = listing, user=request.user)
            f.delete()
            #this was removed from watchlist, so delete from model
        if new_bid.is_valid():
            new_bid = new_bid.cleaned_data["Enter_Bid"]
            #store cleaned input data in variable
            
            if new_bid <= listing.starting_bid:
                return HttpResponseRedirect(reverse("listing", args=(listing.id,)))
                #redirect if bid less than current bid
            else:
                bid = Bid(amount = new_bid, user = request.user, listing = listing)
                bid.save()
                #save new entry into Bid model
                Listing.objects.filter(id = listing_id).update(starting_bid = new_bid)      
                #update current price/bid if bid is greater than
        return HttpResponseRedirect(reverse("listing", args=(listing.id,)))
    
    else:
    #if request method is GET
        try:
            watchlist = Watchlist.objects.get(user = request.user, listing = listing)
            #see if this listing and user has entry in watchlist model
            return render(request, "auctions/listing.html", {
                "listing": listing,
                "bidding_form": BiddingForm(),
                "form": RemoveWatchlist(),
                "bid_history": Bid.objects.filter(listing = listing)
            })
                # give them an option to delete
        except ObjectDoesNotExist: 
            return render(request, "auctions/listing.html", {
                "listing": listing,
                "bidding_form": BiddingForm(),
                "form": AddWatchlist(),
                "bid_history": Bid.objects.filter(listing = listing)
                #TO DO look at django documentation for label
            })
        #otherwise the data does not exist, so give them option to add

def index(request):
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.all()
        #passes on a list of all listings to html
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


