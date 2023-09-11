from django.contrib import admin
from .models import User, Comment, Like, BlogPost, FriendRequest
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

admin.site.register(Comment)
admin.site.register(Like)
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

# Custom method to get a comma-separated list of friend usernames
def get_friends_list(obj):
    return ', '.join([friend.username for friend in obj.friends.all()])

get_friends_list.short_description = 'Friends' 


def remove_selected_friends(modeladmin, request, queryset):
    for user in queryset:
        user.remove_friend(request.user)

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', get_friends_list)
    actions = [remove_selected_friends]

# Register the UserAdmin class for the User model
admin.site.register(User, UserAdmin)

# Register the other models
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(BlogPost)
admin.site.register(FriendRequest)
