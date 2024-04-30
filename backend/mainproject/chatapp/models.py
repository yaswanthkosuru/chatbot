# models.py

from django.db import models
from django.contrib.auth.models import User

class Topic(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Room(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='administered_rooms')
    users = models.ManyToManyField(User, related_name='joined_rooms')

    def __str__(self):
        return self.name

class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.content[:50]}"

