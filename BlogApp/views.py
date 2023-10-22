import os
import re
import uuid
from rest_framework import viewsets, permissions
from BlogApp.serializers import BlogPostSerializer
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render, get_object_or_404
from PersonalBlog import settings
from .models import BlogPost, User, FriendRequest, BlogLike, Comment, CommentLike
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.hashers import make_password
from django.db.models import Q, Exists, OuterRef, Prefetch


@login_required(login_url="login")
def home(request) -> HttpResponse:
    current_user = request.user
    blog = (
        BlogPost.objects.annotate(
            is_liked=Exists(
                BlogLike.objects.filter(
                    user=current_user,
                    blog_post=OuterRef('pk')
                )
            ),
            is_commented=Exists(
                Comment.objects.filter(
                    user=current_user,
                    blog_post=OuterRef('pk')
                )
            )
        )
        .prefetch_related(
            Prefetch(
                'comment_set',
                queryset=Comment.objects.select_related('user').annotate(
                    is_liked=Exists(
                        CommentLike.objects.filter(
                            user=current_user,
                            comment=OuterRef('pk')
                        )
                    ),
                    is_replied=Exists(
                        Comment.objects.filter(
                            user=current_user,
                            parent_comment=OuterRef('pk')
                        )
                    )
                ).only('user__username', 'user__profile_picture_path').
                order_by('-created_at'),
                to_attr='related_comments'
            )
        )
        .order_by('-id')
    )

    friend_info = []
    for friend in request.user.friends.all():
        friend_info.append({'username': friend.username,
                           'picture_path': friend.profile_picture_path})
    context = {"Blog": blog} | create_context(request)
    return render(request, "BlogApp/home.html", context)


def add_blog(request) -> JsonResponse:
    if request.method == 'POST':
        user = request.user
        title = request.POST.get('title', '')
        blog_image = request.FILES.get('blog_image', None)

        if blog_image:
            unique_filename = f'{uuid.uuid4().hex}_{blog_image.name}'

            media_root = settings.MEDIA_ROOT
            image_path = os.path.join(
                media_root, 'blog_images', unique_filename)
            with open(image_path, 'wb') as destination:
                for chunk in blog_image.chunks():
                    destination.write(chunk)

            blog_post = BlogPost(
                user=user, title=title, blog_image_url=f'/media/blog_images/{unique_filename}')
            blog_post.save()

            return JsonResponse({
                'success': 'Vomit created successfully',
                'blog_id': blog_post.id,
                'blog_title': blog_post.title,
                'blog_image_url': blog_post.blog_image_url,
                'blog_like_count': blog_post.like_count,
            })
        else:
            return JsonResponse({'error': 'No image file provided'})

    return JsonResponse({'error': 'Invalid request method'})


def send_friend_request(request) -> JsonResponse:
    if request.method == "POST":
        to_user_username = request.POST.get("username", '')
        to_user = User.objects.get(username=to_user_username)
        reverse_friend_request = FriendRequest.objects.filter(
            from_user__exact=to_user, to_user__exact=request.user)
        friend_request = FriendRequest.objects.filter(
            from_user__exact=request.user, to_user__exact=to_user)
        #! Need to add groups too
        if len(reverse_friend_request) > 0:
            if not reverse_friend_request[0].is_accepted:
                reverse_friend_request[0].accept()
                return JsonResponse({'success': 'Friend request sent succesfully.'})
            else:
                return JsonResponse({'error': 'Friend request already sent.'})
        else:
            if len(friend_request) > 0:
                return JsonResponse({'error': 'Friend request already sent.'})
            else:
                FriendRequest(from_user=request.user, to_user=to_user).save()
                return JsonResponse({'success': 'Friend request sent succesfully.'})

    # TODO change this to 404 Not found
    return JsonResponse({'error': 'Invalid request.'})


def accept_friend_request(request) -> JsonResponse:
    if request.method == "POST":
        #! Need to implement groups
        from_username = request.POST.get("username", '')
        from_user = User.objects.get(username=from_username)
        friend_request = FriendRequest.objects.get(
            from_user=from_user, to_user=request.user)
        if friend_request and friend_request.is_accepted == False:
            friend_request.accept()
            return JsonResponse({
                'success': 'Friend request accepted',
                'FriendInfo': {'username': from_username, 'picture_path': from_user.profile_picture_path}
            })
        else:
            return JsonResponse({'error': 'Friend request expired'})

    # TODO change this to 404 Not found
    return JsonResponse({'error': 'Invalid request.'})


def search(request) -> HttpResponse:
    context = {}
    if request.method == "GET":
        search_keyword = request.GET.get('searchKeyword', '')
        if search_keyword:
            users = User.objects.filter(
                Q(username__contains=search_keyword) & ~Q(username=request.user.username))
            if users:
                users_info = []
                for user in users:
                    users_info.append(
                        {'username': user.username, 'picture_path': user.profile_picture_path})
                context = {"Search_Keyword": search_keyword,
                           "Users": users_info, } | create_context(request)
                print(context)
            else:
                context = {"SearchKeyword": search_keyword} | create_context(
                    request)
        else:
            context = create_context(request)

    return render(request, "BlogApp/search.html", context)


def notifications(request) -> HttpResponse:
    context = {}
    if request.method == 'GET':
        friend_requests = FriendRequest.objects.filter(
            to_user=request.user, is_accepted=False)
        friend_requests_info = []
        for friend in friend_requests:
            friend_requests_info.append(
                {'username': friend.from_user.username, 'picture_path': friend.from_user.profile_picture_path})

        if friend_requests_info:
            context = {"Friend_Requests_Info": friend_requests_info} | create_context(
                request)
        else:
            context = create_context(request)

    return render(request, "BlogApp/notifications.html", context)


def user_profile(request, username: str) -> HttpResponse:
    context = {}
    if request.method == 'GET' and username:
        profile = User.objects.get(username=username)
        current_user = request.user
        profile_posts = (
            BlogPost.objects.filter(user__exact=profile).annotate(
                is_liked=Exists(
                    BlogLike.objects.filter(
                        user=current_user,
                        blog_post=OuterRef('pk')
                    )
                )
            )
            .prefetch_related(
                Prefetch(
                    'comment_set',
                    queryset=Comment.objects.select_related('user').annotate(
                        is_liked=Exists(
                            CommentLike.objects.filter(
                                user=current_user,
                                comment=OuterRef('pk')
                            )
                        ),
                        is_replied=Exists(
                            Comment.objects.filter(
                                user=current_user,
                                parent_comment=OuterRef('pk')
                            )
                        )
                    ).only('user__username', 'user__profile_picture_path').
                    order_by('-created_at'),
                    to_attr='related_comments'
                )
            )
            .order_by('-id')
        )
        context = create_context(request) | {
            "Profile_Username": profile.username,
            "Profile_Email": profile.email,
            "Profile_Picture_Path": profile.profile_picture_path,
            "Thumbnail_Picture_Path": profile.thumbnail_picture_path,
            "Member_Since": profile.date_joined.strftime('%B %e, %Y'),
            "Profile_Posts": profile_posts
        }

    return render(request, 'BlogApp/user_profile.html', context)


def login_user(request) -> HttpResponse:
    if request.method == "POST":
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect("home")
        else:
            errors = form.errors
            context = {"Errors": errors}
            return render(request, "BlogApp/login.html", context)
    return render(request, "BlogApp/login.html")


def register(request) -> HttpResponse:
    context = {}
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
            user = User(email=email, username=username,
                        password=make_password(password))
            user.save()
            login(request, user)
            return redirect('home')
        else:
            context = {
                'Errors': errors,
                'Inputs': inputs
            }
    else:
        errors = {}
        errors['login'] = "Unknown error occured. Please try gain later"
        context = {
            'Errors': errors
        }
    return render(request, 'BlogApp/register.html', context)


def logout_user(request) -> HttpResponse:
    logout(request)
    return redirect('login')


def add_blog_like(request) -> JsonResponse:
    if request.method == "POST":
        blog_id = request.POST.get('blog_id', None)
        blog = BlogPost.objects.get(id=blog_id)
        if blog:
            try:
                new_like = BlogLike(user=request.user, blog_post=blog)
            except Exception:
                return JsonResponse({'error': 'You have already Liked'}, status=404)
            new_like.save()
            return JsonResponse({'success': 'Liked'})
        return JsonResponse({'error': 'Blog does not exist'})
    return JsonResponse({'error': 'Invalid request method'})


def remove_blog_like(request) -> JsonResponse:
    if request.method == "POST":
        blog_id = request.POST.get('blog_id', None)
        blog = BlogPost.objects.get(id=blog_id)
        if blog:
            try:
                deleting_like = BlogLike.objects.get(
                    user=request.user, blog_post=blog)
            except Exception:
                return JsonResponse({'error': 'You have already Unliked'}, status=404)
            deleting_like.delete()
            return JsonResponse({'success': 'Unliked'})
        return JsonResponse({'error': 'Blog does not exist'})
    return JsonResponse({'error': 'Invalid request method'})


def add_comment(request) -> JsonResponse:
    if request.method == "POST":
        comment_content = request.POST.get('comment_content', '').strip()
        if not comment_content:
            return JsonResponse({"error": "Can't send empty comment"})

        is_reply = comment_content.startswith('@')
        parent_comment = None

        if is_reply:
            try:
                _, comment_content = comment_content.split(' ', 1)
            except ValueError:
                return JsonResponse({"error": "Invalid format for reply"})

            parent_comment_id = request.POST.get('comment_id', None)
            parent_comment = get_object_or_404(Comment, id=parent_comment_id)

        blog_id = request.POST.get('blog_id', None)
        blog = get_object_or_404(BlogPost, id=blog_id)

        new_comment = Comment(
            user=request.user,
            content=comment_content,
            blog_post=blog,
            parent_comment=parent_comment
        )
        new_comment.save()

        response_data = {
            'success': 'New Comment Added',
            'comment': {
                'id': new_comment.id,
                'content': new_comment.content,
                'username': new_comment.user.username,
                'profile_picture_path': new_comment.user.profile_picture_path,
                'is_reply': is_reply,
            }
        }

        if is_reply:
            response_data['comment'].update({
                'parent_username': parent_comment.user.username,
            })

        return JsonResponse(response_data)
    return JsonResponse({'error': 'Invalid request method'})


def add_comment_like(request) -> JsonResponse:
    if request.method == "POST":
        comment_id = request.POST.get('comment_id', None)
        comment = Comment.objects.get(id=comment_id)
        if comment:
            try:
                new_like = CommentLike(user=request.user, comment=comment)
            except Exception:
                return JsonResponse({'error': 'You have already Liked'}, status=404)
            new_like.save()
            return JsonResponse({'success': 'Liked'})
        return JsonResponse({'error': 'Comment does not exist'})
    return JsonResponse({'error': 'Invalid request method'})


def remove_comment_like(request) -> JsonResponse:
    if request.method == "POST":
        comment_id = request.POST.get('comment_id', None)
        comment = Comment.objects.get(id=comment_id)
        if comment:
            try:
                deleting_like = CommentLike.objects.get(
                    user=request.user, comment=comment)
            except Exception:
                return JsonResponse({'error': 'You have already Unliked'}, status=404)
            deleting_like.delete()
            return JsonResponse({'success': 'Unliked'})
        return JsonResponse({'error': 'Comment does not exist'})
    return JsonResponse({'error': 'Invalid request method'})


def chat(request)-> HttpResponse:
    context = create_context(request)
    return render(request, "BlogApp/chat.html",context)


def create_context(request) -> dict[str, any]:
    friend_info = []
    for friend in request.user.friends.all():
        friend_info.append({'username': friend.username,
                           'picture_path': friend.profile_picture_path})
    context = {
        "User_Id": request.user.id,
        "Username": request.user.username,
        "User_Picture_Path": request.user.profile_picture_path,
        "Friends_Info": friend_info,
    }
    return context




#! -------------------------------------------------------------REST API Serializers---------------------------------------------------------

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
