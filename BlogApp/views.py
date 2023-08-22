from django.shortcuts import redirect, render
from .models import BlogPost
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm,UserCreationForm


@login_required(login_url="login")
def Home(request):
    blog = BlogPost.objects.first()
    context = {"Blog":blog,
               "User":request.user}
    return render(request,"BlogApp/home.html",context)

def Login(request):
    if request.method == "POST":
        form = AuthenticationForm(request,request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect("home")

    return render(request,"BlogApp/login.html")

def Register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request,user)
            return redirect('home')
    else:
        form = UserCreationForm()

    return render(request,"BlogApp/register.html")
