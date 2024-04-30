from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status,generics
from .models import Topic,Room,Message
from .serializers import RoomSerializer,MessageSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from .serializers import UserSerializer
from .permissions import IsAdminOrReadOnly
from rest_framework.views import APIView
from .serializers import TopicSerializer
from django.shortcuts import render

def index(request):
    return render(request, "chatapp/index.html")
def room(request, room_name):
    return render(request, "chatapp/room.html", {"room_name": room_name})


@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    is_admin = request.data.get('is_admin', False)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.is_staff = is_admin
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data},status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_226_IM_USED)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response("missing user", status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({'token': token.key, 'user': serializer.data})

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAdminOrReadOnly])  # Use the custom permission class
def admin_restricted_view(request):
    return Response("Only admin test passed")


class TopicListCreateView(generics.ListCreateAPIView):
    authentication_classes=[SessionAuthentication,TokenAuthentication]
    permission_classes=[IsAdminOrReadOnly]
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
   

class TopicRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    authentication_classes=[SessionAuthentication,TokenAuthentication]
    permission_classes=[IsAdminOrReadOnly]
    



class RoomListCreateAPIView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    def get_queryset(self):
        user = self.request.user
        return Room.objects.filter(admin=user)
    permission_classes = [IsAdminOrReadOnly]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def perform_create(self, serializer):
        print("Creating",self.request.user)
        room = serializer.save(admin=self.request.user)
        # Add the current authenticated user to the users field
        room.users.add(self.request.user)

class RoomRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Room.objects.filter(admin=user)


class UserRoomListCreateAPIView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def perform_create(self, serializer):
        print("Creating",self.request.user)
        room = serializer.save(admin=self.request.user)
        # Add the current authenticated user to the users field
        room.users.add(self.request.user)


class MessageListCreateAPIView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    authentication_classes = [ TokenAuthentication]
    
    def perform_create(self, serializer):
        print("Creating",self.request.user)
        serializer.save(user=self.request.user)

class MessageRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    
    

class MessageListByRoomAPIView(generics.ListAPIView):
    serializer_class = MessageSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    
    def get_queryset(self):
        room_id = self.kwargs['room_id']
        return Message.objects.filter(room_id=room_id).select_related('user')
        # Add the current authenticated user to the users field
        

    
