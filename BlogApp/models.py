from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(max_length=255, null=False, blank=False, default="example@default.com")
    username = models.CharField(max_length=30, unique=True, null=False, blank=False,default="example_username123")
    password = models.CharField(max_length=128, null=False, blank=False,default="example_password123")
    profile_picture_path = models.CharField(max_length=255, null=True, blank=True, default="/media/profile_images/default.jpg")
    friends = models.ManyToManyField('self', blank=True, symmetrical=False)  # Set symmetrical to False

    def add_friend(self, friend):
        self.friends.add(friend)

    def remove_friend(self, friend):
        self.friends.remove(friend)

class BlogPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    blog_image_url = models.CharField(max_length=200, blank=True, null=True)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    content = models.TextField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True)
