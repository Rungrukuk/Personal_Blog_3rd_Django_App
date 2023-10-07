import django
django.setup()
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from BlogApp.models import Like
import json

class DataRefresh(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action_type = text_data_json.get('action_type')
        print(text_data_json)
        if action_type == 'like':
            response_data = await self.handle_like(text_data_json)
        # elif action_type == 'comment':
        #     response_data = await self.handle_comment(text_data_json) #! Need to Implement handle_comment
        else:
            response_data = {'error': 'Invalid action type'}
            
        await self.send(json.dumps(response_data))

    async def handle_like(self, data):
        post_id = data.get('post_id')
        new_like_count = Like.objects.filter(blog_post_id=post_id).count()
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            "blog",
            {
                'type': 'blog_like',
                'like_data': {'post_id': post_id, 'new_like_count': new_like_count}
            }
        )
        return {'status': 'like_success', 'message': 'Like has been saved.'}
