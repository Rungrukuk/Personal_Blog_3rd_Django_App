from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class CustomUserCreationForm(UserCreationForm):
    profile_picture = forms.ImageField(required=False)  # Allow users to optionally upload a profile picture

    class Meta:
        model = User
        fields = UserCreationForm.Meta.fields + ('profile_picture',)
