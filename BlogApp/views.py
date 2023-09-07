import os, re, uuid
from django.http import JsonResponse
from django.shortcuts import redirect, render
from PersonalBlog import settings
from .models import BlogPost,User, FriendRequest
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login,logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.hashers import make_password
from django.db.models import Q

@login_required(login_url="login")
def Home(request):
    blog = BlogPost.objects.first()
    friend_info = []
    for friend in request.user.friends.all():
        friend_info.append({'Username':friend.username, 'Picture_Path':friend.profile_picture_path})
    context = {
                "Blog":blog,
                "Username":request.user.username,
                "User_Picture_Path": request.user.profile_picture_path,
                "Friends_Info": friend_info,
            }
    return render(request,"BlogApp/home.html",context)

def Create_vomit(request):
    if request.method == 'POST':
        user = request.user 
        title = request.POST.get('title', '')
        blog_image = request.FILES.get('blog_image', None)

        if blog_image:
            # Generate a unique filename for the image
            unique_filename = f'{uuid.uuid4().hex}_{blog_image.name}'
            
            # Save the image to the media directory with the unique filename
            media_root = settings.MEDIA_ROOT
            image_path = os.path.join(media_root, 'blog_images', unique_filename)
            with open(image_path, 'wb') as destination:
                for chunk in blog_image.chunks():
                    destination.write(chunk)
            
            # Create a new BlogPost instance with the unique filename
            blog_post = BlogPost(user=user, title=title, blog_image_url=f'media/blog_images/{unique_filename}')
            blog_post.save()

            # Return the newly created vomit data as JSON
            return JsonResponse({
                'message': 'Vomit created successfully',
                'title': blog_post.title,
                'blog_image_url': blog_post.blog_image_url,
            })
        else:
            return JsonResponse({'error': 'No image file provided'})

    return JsonResponse({'error': 'Invalid request method'})
            

def Send_friend_request(request, to_user_username):
    if request.method == 'POST':
        to_user = User.objects.get(username=to_user_username)
        
        if not FriendRequest.objects.filter(from_user=request.user, to_user=to_user).exists():
            friend_request = FriendRequest(from_user=request.user, to_user=to_user)
            friend_request.save()
            return JsonResponse({'message': 'Friend request sent'})
        else:
            return JsonResponse({'error': 'Friend request already sent'})
    
    return JsonResponse({'error': 'Invalid request'})


def accept_friend_request(request, friend_request_id):
    #! Need to send POST REQUEST WITH AJAX
    friend_request = FriendRequest.objects.get(id=friend_request_id)
    friend_request.accept()
    return redirect('profile_page')



@login_required(login_url="login")
def Search(request):
    search_keyword = request.GET.get('searchKeyword','')
    friend_info = []
    for friend in request.user.friends.all():
        friend_info.append({'Username':friend.username, 'Picture_Path':friend.profile_picture_path})
    if search_keyword:
        users = User.objects.filter(Q(username__contains=search_keyword) & ~Q(username=request.user.username))
        #Need to implement groups

        context = {
                #need to add groups too
                "Search_Keyword":search_keyword,
                "Users":users,
                "Username":request.user.username,
                "User_Picture_Path": request.user.profile_picture_path,
                "Friends_Info": friend_info,
            }
        return render(request,"BlogApp/search.html",context)
    context = {
                "SearchKeyword":search_keyword,
                "Username":request.user.username,
                "User_Picture_Path": request.user.profile_picture_path,
                "Friends_Info": friend_info,
            }
    return render(request,"BlogApp/search.html",context)



def Login(request):
    if request.method == "POST":
        form = AuthenticationForm(request,request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect("home")
        else:
            errors = form.errors
            context = {"Errors": errors}
            return render(request,"BlogApp/login.html",context)
    return render(request,"BlogApp/login.html")


def Register(request):
    if request.method == 'POST':
        email = request.POST.get('mail')
        username = request.POST.get('username')
        password = request.POST.get('password')
        re_password = request.POST.get('re-password')

        errors = {}
        inputs = {}
        if not email:
            errors['email'] = 'This field is required'
        elif not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            errors['email'] = 'Invalid email format'
        elif User.objects.filter(email=email).exists():
            errors['email'] = 'This Email has already been registered'
        else: 
            inputs['email'] = email

        if not username:
            errors['username'] = 'This field is required'
        elif not re.match(r'^[a-zA-Z0-9._-]+$', username):
            errors['username'] = 'Invalid characters in username'
        else:
            inputs['username'] = username

        if not password:
            errors['password'] = 'This field is required'
        elif re.search(r'\b(OR|AND)\b', password, re.IGNORECASE):
            errors['password'] = 'Invalid characters in password'
        else:
            inputs['password'] = password

        if not re_password:
            errors['re_password'] = 'This field is required'
        elif password != re_password:
            errors['re_password'] = 'Passwords should match'
        else:
            inputs['re_password'] = re_password



        if not errors:
            user = User(email=email, username=username, password=make_password(password))
            user.save()
            login(request,user)
            return redirect('home')
        else:
            context = {
                'Errors': errors,
                'Inputs': inputs
            }
            return render(request, 'BlogApp/register.html', context)
            

    else:
        errors = {}
        errors['login'] = "Unknown error occured. Please try gain later"
        context = {
            'Errors': errors
        }
        return render(request, 'BlogApp/register.html', context)

def Logout(request):
    logout(request)
    return redirect('home')