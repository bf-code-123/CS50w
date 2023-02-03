from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.forms import ModelForm, Textarea
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import User, Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        exclude = ['creator','datetime']
        # TODO: fix the column number
        widgets = {
            'content': Textarea(attrs={'cols': 132, 'rows': 3}),
        }


# def index(request):
#     if request.method == "POST":
#         form = PostForm(request.POST)
#         #store data from New Post form into a variable
#         if form.is_valid():
#             new_post = form.save(commit=False)
#             #save it into a variable but don't commit (so it's editable)
#             new_post.creator = request.user
#             #insert current user as creator value 
#             new_post.save()
#             #save new data entry
#             return HttpResponseRedirect(reverse('index'))
#             #send to index page)
#     posts = reversed(Post.objects.all())
#     return render(request, "network/index.html", {
#         "posts" : posts,
#         "form" : PostForm()
#     })

def index(request):
    # Authenticated users view the feed
    if request.user.is_authenticated:
        posts = reversed(Post.objects.all())
        return render(request, "network/index.html", {
        "posts" : posts,
        "form" : PostForm()
    })
    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))

@csrf_exempt
@login_required
def post(request):
    # Creating a new post must be via POST request
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Check recipient emails
    data = json.loads(request.body)

    # Get contents of email
    content = data.get("content", "")

    #create new post in Django model
    post = Post(
            content=content,
            creator=request.user
        )
    post.save()

    return JsonResponse({"message": "Email sent successfully."}, status=201)

def user(request, user_name):
    return render(request, "network/user.html", {
        "user_name" : user_name
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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
