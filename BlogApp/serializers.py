from rest_framework import serializers
from .models import BlogPost, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email','username','password','profile_picture_path','friends']

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['user','title','created_at','blog_image_url']
