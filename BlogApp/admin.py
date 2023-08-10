from django.contrib import admin

from .models import User, Comment, Like, BlogPost

my_models = [User,Comment,Like,BlogPost]

for my_model in my_models:
    admin.site.register(my_model)

