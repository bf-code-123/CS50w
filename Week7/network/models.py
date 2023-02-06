from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime


class User(AbstractUser):
    pass

class Post(models.Model):
    content = models.CharField(max_length=256)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, related_name="posts", default="")
    datetime = models.DateTimeField(blank=False, default=datetime.now)
    #related name allows to search for all posts for a given user

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "creator": self.creator,
            "datetime": self.datetime
        }

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, related_name="likes", default="")
    listing = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes", default="")

class Comment(models.Model):
    comment = models.CharField(max_length=128)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments", default="")
    listing = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments", default="")