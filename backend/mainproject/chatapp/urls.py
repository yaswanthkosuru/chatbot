from django.urls import re_path,path
from .views import TopicListCreateView, TopicRetrieveUpdateDestroyView,RoomListCreateAPIView,UserRoomListCreateAPIView,RoomRetrieveUpdateDestroyAPIView,MessageListByRoomAPIView,MessageRetrieveUpdateDestroyAPIView,MessageListCreateAPIView
from . import views

urlpatterns = [
    re_path('signup', views.signup),
    re_path('login', views.login),
    re_path('test_token', views.test_token),
    re_path("test_admin_token",views.admin_restricted_view),
    path('topics/', TopicListCreateView.as_view(), name='topic-list-create'),
    path('topics/<int:pk>/', TopicRetrieveUpdateDestroyView.as_view(), name='topic-retrieve-update-destroy'),
    path('rooms/', RoomListCreateAPIView.as_view(), name='room-list-create'),
    path('rooms/<int:pk>/', RoomRetrieveUpdateDestroyAPIView.as_view(), name='topic-retrieve-update-destroy'),
    path('userrooms/', UserRoomListCreateAPIView.as_view(), name='room-list-create'),
    path("",views.index,name="index"),
    path('messages/', MessageListCreateAPIView.as_view(), name='message-list-create'),
    path('messages/<int:pk>/', MessageRetrieveUpdateDestroyAPIView.as_view(), name='message-retrieve-update-destroy'),
    path('messages/room/<int:room_id>/', MessageListByRoomAPIView.as_view(), name='message-list-by-room'),
]
