from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    content = models.CharField(max_length=256)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, related_name="posts", default="")
    #related name allows to search for all posts for a given user