from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path,include
from rest_framework import routers
from BlogApp.views import UserViewSet, BlogPostViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'blogposts', BlogPostViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('', include('BlogApp.urls')),
   
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)