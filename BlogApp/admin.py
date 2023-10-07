from django.contrib import admin
from .models import User, Comment, BlogLike, BlogPost, FriendRequest
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

admin.site.register(Comment)
admin.site.register(BlogLike)
admin.site.register(BlogPost)
admin.site.register(FriendRequest)
class FriendsInline(admin.TabularInline):  
    model = User.friends.through  
    fk_name = 'from_user'  
    extra = 0 

class UserAdmin(DefaultUserAdmin):
    inlines = [FriendsInline]
    exclude = ('friends',)  

admin.site.register(User, UserAdmin)



