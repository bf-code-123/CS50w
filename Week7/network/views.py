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
        return render(request, "network/index.html", {
            #"form" : PostForm()
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

    # Check JSON body sent from fetch request
    data = json.loads(request.body)

    # Get contents of post
    content = data.get("content")

    # if content is blank, return error so model does not save
    if content == "":
        return JsonResponse({"error": "Text required."}, status=400)
    else:
        #create new post in Django model
        post = Post(
                content=content,
                creator=request.user
            )
        post.save()
        
    return JsonResponse({"message": "Post created successfully."}, status=201)

# @csrf_exempt
# @login_required
# def one_post(request):

#     # Query for requested email
#     try:
#         post = Post.objects.all()
#     except Post.DoesNotExist:
#         return JsonResponse({"error": "Post not found."}, status=404)

#     # Return email contents
#     if request.method == "GET":
#         return JsonResponse(post.serialize())

#     # load the request int
#     elif request.method == "PUT":
#         return HttpResponse(status=204)

#     # Post must be via GET or PUT
#     else:
#         return JsonResponse({
#             "error": "GET or PUT request required."
#         }, status=400)

@login_required
def load(request):
    posts = Post.objects.all()
    posts = posts.order_by("-datetime").all()
    #posts = [post.serialize() for post in Post.objects.order_by('-datetime')]
    return JsonResponse([post.serialize() for post in posts], safe=False)

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
