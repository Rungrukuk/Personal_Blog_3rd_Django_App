from django.shortcuts import render
from .models import BlogPost

def Home(request):
    blog = BlogPost.objects.first()
    context = {"Blog":blog}
    return render(request,"BlogApp/home.html",context)

def Login(request):
    return render(request,"BlogApp/login.html")

def Register(request):
    return render(request,"BlogApp/register.html")
