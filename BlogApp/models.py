from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(max_length=255, null=False, blank=False, default="")
    username = models.CharField(max_length=30, unique=True, null=False, blank=False,default="")
    password = models.CharField(max_length=128, null=False, blank=False,default="")
    profile_picture_path = models.CharField(max_length=255, null=True, blank=True, default="/media/profile_images/default.jpg")
    friends = models.ManyToManyField('self', blank=True, symmetrical=False)
    def remove_friend(self, friend):
        friend.friends.remove(self) #! fix this 
        self.friends.remove(friend)


class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name="sent_friend_requests", on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name="received_friend_requests", on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def accept(self):
        if not self.is_accepted:
            self.is_accepted = True
            self.save()
            self.from_user.friends.add(self.to_user)
            self.to_user.friends.add(self.from_user)


class BlogPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    blog_image_url = models.CharField(max_length=200, blank=True, null=True)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    content = models.TextField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True)
