from rest_framework import serializers,generics
from .models import Topic,Room,Message
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status,generics

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User 
        fields = ['id', 'username', 'password', 'email']

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name']



class RoomSerializer(serializers.ModelSerializer):
    topic_name = serializers.ReadOnlyField(source='topic.name')
    class Meta:
        model = Room
        fields = ['id', 'topic_name', 'name',"topic"]

class MessageSerializer(serializers.ModelSerializer):
    room_name=serializers.ReadOnlyField(source='room.name')
    user_name=serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Message
        fields = ["content","timestamp","user_name","room_name","room"]
      


        

