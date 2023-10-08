import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PersonalBlog.settings')
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import BlogApp.routing


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            BlogApp.routing.websocket_urlpatterns
        )
    ),
})
