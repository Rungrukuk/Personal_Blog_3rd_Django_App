from django.contrib import admin
from .models import User, Comment, Like, BlogPost, FriendRequest

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
