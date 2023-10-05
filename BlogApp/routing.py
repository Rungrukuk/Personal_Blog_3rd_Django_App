from django.urls import re_path
from . import consumers
websocket_urlpatterns = [
    re_path(r'ws/infos/$', consumers.DataRefresh.as_asgi()),
]
