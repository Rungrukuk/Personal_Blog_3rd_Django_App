from django.shortcuts import redirect, render
from .models import BlogPost,User
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login,logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError


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
        email = request.POST['mail']
        username = request.POST['username']
        password = request.POST['password']
        re_password = request.POST['re-password']
        profile_image = request.FILES.get('image')
        
        if password != re_password:
            raise ValidationError("Passwords do not match")
        
        if User.objects.filter(email=email).exists():
            raise ValidationError("Email is already registered")
        
        user = User(email=email, username=username, password=make_password(password), profile_picture=profile_image)
        user.save()
        
        # Log the user in
        login(request, user)
        return redirect('home')

    return render(request, "BlogApp/register.html")

def Logout_view(request):
    logout(request)
    return redirect('home')