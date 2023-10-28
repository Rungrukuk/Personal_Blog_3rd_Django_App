import django
django.setup()
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatMessage, User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender_username = self.scope['url_route']['kwargs']['sender_username']
        self.receiver_username = self.scope['url_route']['kwargs']['receiver_username']
        sorted_usernames = sorted([self.sender_username, self.receiver_username])
        self.room_name = f"private_chat_{sorted_usernames[0]}_{sorted_usernames[1]}"

        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        messageId = text_data_json.get('messageId')

        await self.save_message(self.sender_username, self.receiver_username, message)

        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'message': message,
                'messageId': messageId,
                'channel_name': self.channel_name  
            }
        )



    async def chat_message(self, event):
        message = event['message']
        messageId = event.get('messageId')

        if self.channel_name != event['channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'received',
                'message': message,
                'messageId': messageId
            }))
        
        else:
            await self.send(text_data=json.dumps({
                'type': 'confirmation',
                'messageId': messageId
            }))


    @database_sync_to_async
    def save_message(self, sender_username, receiver_username, content):
        sender = User.objects.get(username=sender_username)
        receiver = User.objects.get(username=receiver_username)
        ChatMessage.objects.create(sender=sender, receiver=receiver, content=content)
