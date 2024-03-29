
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("user/<str:user_name>", views.user, name="user"),

    # API Routes
    path("post", views.post, name="post"),
    path("load", views.load, name="load"),
    path("edit", views.edit, name="edit"),
    path("like", views.like, name="like")
]
