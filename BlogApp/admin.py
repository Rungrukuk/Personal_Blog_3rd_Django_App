from django.contrib import admin

from .models import User, Comment, Like, BlogPost, FriendRequest

my_models = [User,Comment,Like,BlogPost, FriendRequest]

for my_model in my_models:
    admin.site.register(my_model)

