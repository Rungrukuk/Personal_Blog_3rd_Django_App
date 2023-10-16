from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import User, Comment, BlogLike, BlogPost, FriendRequest, CommentLike

admin.site.register(Comment)
admin.site.register(BlogLike)
admin.site.register(BlogPost)
admin.site.register(FriendRequest)
admin.site.register(CommentLike)

class FriendsInline(admin.TabularInline):  
    model = User.friends.through  
    fk_name = 'from_user'  
    extra = 0 

class UserAdmin(DefaultUserAdmin):
    inlines = [FriendsInline]
    exclude = ('friends',)  
    
    add_fieldsets = DefaultUserAdmin.add_fieldsets + (
        (None, {
            'fields': ('profile_picture_path', 'thumbnail_picture_path'),
        }),
    )
    
    fieldsets = DefaultUserAdmin.fieldsets + (
        (None, {
            'fields': ('profile_picture_path', 'thumbnail_picture_path'),
        }),
    )
    
    list_display = ['username', 'email', 'profile_picture_path', 'thumbnail_picture_path']

admin.site.register(User, UserAdmin)
