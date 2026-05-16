from rest_framework import viewsets, permissions, status, filters, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db.models import Q
from math import radians, sin, cos, sqrt, atan2

from .models import (
    Doacao, CategoriaItem, Usuario, Doador, Receptor, PontoColeta,
    ItemDoacao, Interesse, Mensagem
)
from .serializers import (
    DoacaoSerializer, CategoriaItemSerializer, UsuarioSerializer, DoadorSerializer,
    ReceptorSerializer, PontoColetaSerializer, ItemDoacaoSerializer,
    InteresseSerializer, MensagemSerializer
)
import logging
from rest_framework.exceptions import ValidationError


def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c


class CategoriaItemViewSet(viewsets.ModelViewSet):
    queryset = CategoriaItem.objects.all()
    serializer_class = CategoriaItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    search_fields = ['nome', 'descricao']


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tipo', 'aceite_termos']
    search_fields = ['user__username', 'user__email']

    @action(detail=False, methods=['get'])
    def me(self, request):
        try:
            usuario = Usuario.objects.get(user=request.user)
            serializer = self.get_serializer(usuario)
            return Response(serializer.data)
        except Usuario.DoesNotExist:
            return Response({'detail': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)


class DoadorViewSet(viewsets.ModelViewSet):
    queryset = Doador.objects.filter(ativo=True)
    serializer_class = DoadorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['faixa_idade', 'faixa_renda']
    search_fields = ['usuario__user__username', 'biografia']

    @action(detail=False, methods=['get'])
    def proximos(self, request):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        km = float(request.query_params.get('km', 10))

        if not lat or not lon:
            return Response({'error': 'lat e lon são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)

        lat, lon = float(lat), float(lon)
        doadores_proximos = []

        for doador in self.get_queryset():
            if doador.usuario.latitude and doador.usuario.longitude:
                dist = haversine_distance(
                    float(lat), float(lon),
                    float(doador.usuario.latitude), float(doador.usuario.longitude)
                )
                if dist <= km:
                    doadores_proximos.append({
                        'doador': DoadorSerializer(doador).data,
                        'distancia_km': round(dist, 2)
                    })

        return Response(doadores_proximos)


class ReceptorViewSet(viewsets.ModelViewSet):
    queryset = Receptor.objects.filter(ativo=True)
    serializer_class = ReceptorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tipo', 'disponibilidade_retirada']
    search_fields = ['usuario__user__username', 'responsavel', 'sobre']

    @action(detail=False, methods=['get'])
    def proximos(self, request):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        km = float(request.query_params.get('km', 10))
        tipo = request.query_params.get('tipo')

        if not lat or not lon:
            return Response({'error': 'lat e lon são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)

        lat, lon = float(lat), float(lon)
        receptores_proximos = []
        queryset = self.get_queryset()

        if tipo:
            queryset = queryset.filter(tipo=tipo)

        for receptor in queryset:
            if receptor.usuario.latitude and receptor.usuario.longitude:
                dist = haversine_distance(
                    float(lat), float(lon),
                    float(receptor.usuario.latitude), float(receptor.usuario.longitude)
                )
                if dist <= km:
                    receptores_proximos.append({
                        'receptor': ReceptorSerializer(receptor).data,
                        'distancia_km': round(dist, 2)
                    })

        return Response(receptores_proximos)


class PontoColetaViewSet(viewsets.ModelViewSet):
    queryset = PontoColeta.objects.filter(ativo=True)
    serializer_class = PontoColetaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['tipo']
    search_fields = ['nome', 'endereco', 'email']

    @action(detail=False, methods=['get'])
    def proximos(self, request):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        km = float(request.query_params.get('km', 10))

        if not lat or not lon:
            return Response({'error': 'lat e lon são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)

        lat, lon = float(lat), float(lon)
        pontos_proximos = []

        for ponto in self.get_queryset():
            dist = haversine_distance(
                float(lat), float(lon),
                float(ponto.latitude), float(ponto.longitude)
            )
            if dist <= km:
                pontos_proximos.append({
                    'ponto': PontoColetaSerializer(ponto).data,
                    'distancia_km': round(dist, 2)
                })

        return Response(pontos_proximos)


class ItemDoacaoViewSet(viewsets.ModelViewSet):
    queryset = ItemDoacao.objects.filter(status__in=['disponivel', 'interessado'])
    serializer_class = ItemDoacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'status']
    search_fields = ['titulo', 'descricao']
    ordering_fields = ['data_criacao', 'quantidade']

    def perform_create(self, serializer):
        usuario = Usuario.objects.get(user=self.request.user)
        doador, _ = Doador.objects.get_or_create(
            usuario=usuario,
            defaults={
                'cpf': f'{self.request.user.id:011d}',
            },
        )
        serializer.save(doador=doador)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            logger = logging.getLogger(__name__)
            logger.error('ItemDoacao create validation error: %s; request data: %s', e.detail, request.data)
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def expressar_interesse(self, request, pk=None):
        item = self.get_object()
        try:
            receptor = Receptor.objects.get(usuario__user=request.user)
            interesse, created = Interesse.objects.get_or_create(
                item=item,
                receptor=receptor,
                defaults={'mensagem_inicial': request.data.get('mensagem', '')}
            )
            if not created:
                return Response(
                    {'error': 'Você já expressou interesse neste item'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer = InteresseSerializer(interesse)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Receptor.DoesNotExist:
            return Response(
                {'error': 'Apenas receptores podem expressar interesse'},
                status=status.HTTP_403_FORBIDDEN
            )

    @action(detail=False, methods=['get'])
    def meus_itens(self, request):
        try:
            doador = Doador.objects.get(usuario__user=request.user)
            itens = ItemDoacao.objects.filter(doador=doador)
            serializer = self.get_serializer(itens, many=True)
            return Response(serializer.data)
        except Doador.DoesNotExist:
            return Response({'error': 'Apenas doadores têm itens'}, status=status.HTTP_403_FORBIDDEN)


class InteresseViewSet(viewsets.ModelViewSet):
    queryset = Interesse.objects.all()
    serializer_class = InteresseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'item']

    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        interesse = self.get_object()
        interesse.status = 'confirmado'
        interesse.save()
        serializer = self.get_serializer(interesse)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        interesse = self.get_object()
        interesse.status = 'cancelado'
        interesse.save()
        serializer = self.get_serializer(interesse)
        return Response(serializer.data)


class MensagemViewSet(viewsets.ModelViewSet):
    queryset = Mensagem.objects.all()
    serializer_class = MensagemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['lida']
    ordering_fields = ['data_criacao']

    def perform_create(self, serializer):
        serializer.save(remetente=self.request.user.perfil_doaperto)

    @action(detail=False, methods=['get'])
    def conversa(self, request):
        outro_usuario_id = request.query_params.get('usuario_id')
        if not outro_usuario_id:
            return Response({'error': 'usuario_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)

        usuario_atual = request.user.perfil_doaperto
        outro_usuario = Usuario.objects.get(id=outro_usuario_id)

        mensagens = Mensagem.objects.filter(
            Q(remetente=usuario_atual, destinatario=outro_usuario) |
            Q(remetente=outro_usuario, destinatario=usuario_atual)
        ).order_by('data_criacao')

        serializer = self.get_serializer(mensagens, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def nao_lidas(self, request):
        usuario = request.user.perfil_doaperto
        mensagens = Mensagem.objects.filter(destinatario=usuario, lida=False)
        serializer = self.get_serializer(mensagens, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def registro(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    tipo = request.data.get('tipo', 'doador')

    if not username or not email or not password:
        return Response({'detail': 'username, email e password são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Usuário já existe'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name
        )

        usuario = Usuario.objects.create(
            user=user,
            tipo=tipo if tipo in ['doador', 'receptor'] else 'doador',
            aceite_termos=True
        )

        if usuario.tipo == 'doador':
            Doador.objects.get_or_create(
                usuario=usuario,
                defaults={'cpf': f'{user.id:011d}'}
            )
        else:
            Receptor.objects.get_or_create(
                usuario=usuario,
                defaults={'tipo': 'pessoa'}
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'username': user.username,
                'email': user.email,
                'tipo': usuario.tipo
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DoacaoViewSet(viewsets.ModelViewSet):
    queryset = Doacao.objects.all()
    serializer_class = DoacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]