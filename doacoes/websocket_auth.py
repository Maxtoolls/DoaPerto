from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication


class JWTAuthMiddleware:
    """Authenticate Channels connections with the same JWT used by the API."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        token = parse_qs(query_string).get('token', [None])[0]
        scope['user'] = await self.get_user(token)
        return await self.app(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token):
        if not token:
            return AnonymousUser()
        try:
            authentication = JWTAuthentication()
            validated_token = authentication.get_validated_token(token)
            return authentication.get_user(validated_token)
        except Exception:
            return AnonymousUser()
