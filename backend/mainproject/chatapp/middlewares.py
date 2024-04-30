from channels.db import database_sync_to_async
from django.contrib.auth.models import User,AnonymousUser
from urllib.parse import parse_qs
@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class QueryAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).
        # print(scope["query_string"])
        query_string = parse_qs(scope.get("query_string", b"").decode())
        user_id = query_string.get("user_id", [None])[0]
        scope['user'] = await get_user(user_id)
        # print(scope["user"],"Scope returned")

        return await self.app(scope, receive, send)