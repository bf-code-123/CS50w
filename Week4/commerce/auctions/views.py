from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.core.exceptions import ObjectDoesNotExist
from django.forms import ModelForm, Textarea

from .models import User, Listing, Bid, Comment, Watchlist

class BiddingForm(forms.Form):
    Enter_Bid = forms.IntegerField(error_messages={'required': 'New bid must be greater than current bid'})
class Create(forms.ModelForm):
    class Meta:
        model = Listing
        exclude = ['creator']
        widgets = {
            'description': Textarea(attrs={'cols': 40, 'rows': 10}),
        }
class Comment(forms.ModelForm):
    class Meta:
        model = Comment
        exclude = ['user', 'listing']
        widgets = {
            'comment': Textarea(attrs={'cols': 40, 'rows': 10}),
        }


def watchlist(request):
    return render(request, "auctions/watchlist.html", {
        "watchlist": Watchlist.objects.filter(user=request.user)
    })

def create(request):
    if request.method == "POST":
        form = Create(request.POST)
        if form.is_valid():
            new_listing = form.save(commit=False)
            new_listing.creator = request.user
            new_listing.save()
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, "auctions/create.html", {
                "form":new_listing
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
        if "Watchlist" in request.POST:
            f = Watchlist.objects.filter(listing = listing, user=request.user)
            if f.exists():
                f.delete()
            else:
                f = Watchlist(listing = listing, user=request.user)
                f.save()

        new_bid = BiddingForm(request.POST)
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
        return render(request, "auctions/listing.html", {
            "listing": listing,
            "bidding_form": BiddingForm(),
            "bid_history": Bid.objects.filter(listing = listing),
            "comments": Comment.objects.filter(listing = listing),
            "user":request.user
        })

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


