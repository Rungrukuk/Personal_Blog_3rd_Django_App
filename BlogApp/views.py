from django.shortcuts import render
from .models import BlogPost

def Home(request):
    blog = BlogPost.objects.first()
    context = {"Blog":blog}
    return render(request,"BlogApp/home.html",context)
