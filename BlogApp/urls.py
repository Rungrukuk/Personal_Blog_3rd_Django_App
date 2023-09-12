from django.urls import path
from . import views

urlpatterns = [
    path('',views.Home,name="home"),
    path('login',views.Login,name="login"),
    path('register',views.Register,name="register"),
    path('logout',views.Logout,name="logout"),
    path('create_vomit',views.Create_vomit,name="create_vomit"),
    path('search', views.Search, name='search'),
    path('notifications', views.Notifications, name='notifications'),
    path('send_friend_request', views.send_friend_request, name='send_friend_request'),
    path('accept_friend_request', views.accept_friend_request, name='accept_friend_request'),

]