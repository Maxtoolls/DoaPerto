from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.db.models import Q

from .models import Mensagem, Usuario
from .serializers import MensagemSerializer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close(code=4401)
            return

        self.usuario = await self.get_usuario(self.scope['user'].id)
        self.destinatario = await self.get_destinatario(self.scope['url_route']['kwargs']['usuario_id'])
        if not self.usuario or not self.destinatario or self.usuario.id == self.destinatario.id:
            await self.close(code=4403)
            return

        self.group_name = f'chat_user_{self.usuario.id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        historico = await self.get_history(self.usuario.id, self.destinatario.id)
        await self.send_json({'type': 'history', 'messages': historico})

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        texto = str(content.get('content', '')).strip()
        if not texto:
            await self.send_json({'type': 'error', 'detail': 'A mensagem não pode ficar vazia.'})
            return
        mensagem = await self.create_message(self.usuario.id, self.destinatario.id, texto)
        payload = {'type': 'chat_message', 'message': mensagem}
        await self.channel_layer.group_send(f'chat_user_{self.usuario.id}', payload)
        await self.channel_layer.group_send(f'chat_user_{self.destinatario.id}', payload)

    async def chat_message(self, event):
        await self.send_json({'type': 'message', 'message': event['message']})

    @database_sync_to_async
    def get_usuario(self, user_id):
        return Usuario.objects.filter(user_id=user_id).first()

    @database_sync_to_async
    def get_destinatario(self, usuario_id):
        return Usuario.objects.filter(id=usuario_id).first()

    @database_sync_to_async
    def get_history(self, usuario_id, destinatario_id):
        mensagens = Mensagem.objects.filter(
            Q(remetente_id=usuario_id, destinatario_id=destinatario_id)
            | Q(remetente_id=destinatario_id, destinatario_id=usuario_id)
        ).order_by('data_criacao')
        return MensagemSerializer(mensagens, many=True).data

    @database_sync_to_async
    def create_message(self, remetente_id, destinatario_id, content):
        mensagem = Mensagem.objects.create(
            remetente_id=remetente_id,
            destinatario_id=destinatario_id,
            conteudo=content,
        )
        return MensagemSerializer(mensagem).data
