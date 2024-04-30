import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.auth import login

class ChatConsumer(AsyncWebsocketConsumer):
    def forward_message(self, event):
        """
        
        Utility handler for messages to be broadcasted to groups.  Will be
        called from channel layer messages with `"type": "forward.message"`.
        """
        self.send(event["message"])
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
 

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        # print(len(self.channel_layer),"no of users connected")
        await self.accept()
    

    async def disconnect(self, close_code):
        
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
  
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        user=self.scope["user"]
        content = text_data_json["content"]
        user_name=text_data_json["user_name"]
        timestamp=text_data_json["timestamp"]
        
        await login(self.scope,user)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.message", 
                                    "content": content,
                                    "user_name":user_name,
                                    "timestamp":timestamp
                                   }
        )

    # Receive message from room group
    async def chat_message(self, event):
        content = event["content"]
        user_name=event["user_name"]
        timestamp=event["timestamp"]
        print(self.scope['user'],"user")
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "content": content,
            "username":user_name,
            "timestamp":timestamp
        }))