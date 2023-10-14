from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(max_length=255, null=False, blank=False, default="example@default.com")
    username = models.CharField(max_length=30, unique=True, null=False, blank=False,default="example_username123")
    password = models.CharField(max_length=128, null=False, blank=False,default="example_password123")
    profile_picture_path = models.CharField(max_length=255, null=True, blank=True, default="/media/profile_images/default.jpg")
    thumbnail_picture_path = models.CharField(max_length=255, null=True, blank=True, default="/media/thumbnail_images/default.jpg")
    friends = models.ManyToManyField('self', blank=True, symmetrical=False)
    def remove_friend(self, friend):
        friend.friends.remove(self)
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

    @property
    def comment_count(self):
        return self.comment_set.count()

    @property
    def like_count(self):
        return self.bloglike_set.count()

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    content = models.TextField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True, blank=True)
    parent_comment = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)

    @property
    def reply_count(self):
        return self.replies.count()

    @property
    def like_count(self):
        return self.commentlike_set.count()



class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    
class BlogLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True)