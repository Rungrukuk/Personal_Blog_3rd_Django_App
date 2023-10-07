from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from BlogApp.views import BlogPostViewSet

router = DefaultRouter()
router.register(r'Blogposts', BlogPostViewSet)

urlpatterns = [
    path('',views.home,name="home"),
    path('login',views.login_user,name="login"),
    path('register',views.register,name="register"),
    path('logout',views.logout_user,name="logout"),
    path('create_vomit',views.create_vomit,name="create_vomit"),
    path('search', views.search, name='search'),
    path('notifications', views.notifications, name='notifications'),
    path('send_friend_request', views.send_friend_request, name='send_friend_request'),
    path('accept_friend_request', views.accept_friend_request, name='accept_friend_request'),
    path('user_profile/<str:username>', views.user_profile, name='user_profile'),
    path('add_blog_like', views.add_blog_like, name='add_blog_like'),
    path('remove_blog_like', views.remove_blog_like, name='remove_blog_like'),
    path('api/', include(router.urls)),
]