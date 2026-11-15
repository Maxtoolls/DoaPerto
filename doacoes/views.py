from rest_framework import viewsets, permissions, status, filters, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Q
from math import radians, sin, cos, sqrt, atan2

from .models import (
    Doacao, CategoriaItem, Usuario, Doador, Receptor, PontoColeta,
    ItemDoacao, Interesse, Mensagem, EventoDoacao
)
from .serializers import (
    DoacaoSerializer, CategoriaItemSerializer, UsuarioSerializer, DoadorSerializer,
    ReceptorSerializer, PontoColetaSerializer, ItemDoacaoSerializer,
    InteresseSerializer, MensagemSerializer, EventoDoacaoSerializer
    , MatchSerializer, EntidadeSerializer
)
import logging
from datetime import date
from rest_framework.exceptions import PermissionDenied, ValidationError


def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c


def usuario_pode_configurar_localizacao(usuario):
    receptor = getattr(usuario, 'receptor', None)
    return (
        usuario.tipo == 'receptor'
        and receptor is not None
        and receptor.tipo != 'pessoa'
    )


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

    @action(detail=False, methods=['get', 'put', 'patch', 'delete'])
    def me(self, request):
        # Support GET, PUT/PATCH and DELETE on /usuarios/me/
        try:
            usuario = Usuario.objects.get(user=request.user)
        except Usuario.DoesNotExist:
            return Response({'detail': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = self.get_serializer(usuario)
            return Response(serializer.data)

        if request.method in ['PUT', 'PATCH']:
            data = request.data
            if ('latitude' in data or 'longitude' in data) and not usuario_pode_configurar_localizacao(usuario):
                return Response(
                    {'detail': 'A geolocalização do perfil está disponível apenas para instituições e entidades.'},
                    status=status.HTTP_403_FORBIDDEN,
                )
            # update related Django User fields if provided
            user = request.user
            user_changed = False
            if 'first_name' in data:
                user.first_name = data.get('first_name') or ''
                user_changed = True
            if 'last_name' in data:
                user.last_name = data.get('last_name') or ''
                user_changed = True
            if 'email' in data:
                user.email = data.get('email') or ''
                user_changed = True
            if user_changed:
                user.save()

            # update Usuario model fields
            serializer = self.get_serializer(usuario, data=data, partial=(request.method == 'PATCH'))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        if request.method == 'DELETE':
            # delete both perfil and Django user to fully remove account
            user = request.user
            try:
                usuario.delete()
            except Exception:
                pass
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


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

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        receptor = Receptor.objects.filter(usuario__user=request.user).first()
        if not receptor:
            return Response(
                {'detail': 'Cadastro de receptor não encontrado.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        if request.method == 'GET':
            return Response(self.get_serializer(receptor).data)
        serializer = self.get_serializer(
            receptor,
            data=request.data,
            partial=request.method == 'PATCH',
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def entidades(self, request):
        entidades = self.get_queryset().exclude(tipo='pessoa')
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        km = request.query_params.get('km')

        if not (lat and lon and km):
            return Response(EntidadeSerializer(entidades, many=True, context={'request': request}).data)

        try:
            origem = (float(lat), float(lon))
            limite = float(km)
        except (TypeError, ValueError):
            return Response(
                {'error': 'lat, lon e km devem ser numéricos.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        proximas = []
        for entidade in entidades:
            if entidade.usuario.latitude is None or entidade.usuario.longitude is None:
                continue
            distancia = haversine_distance(
                origem[0], origem[1],
                float(entidade.usuario.latitude),
                float(entidade.usuario.longitude),
            )
            if distancia <= limite:
                proximas.append({
                    'entidade': EntidadeSerializer(
                        entidade, context={'request': request}
                    ).data,
                    'distancia_km': round(distancia, 2),
                })
        proximas.sort(key=lambda item: item['distancia_km'])
        return Response(proximas)

    @action(detail=True, methods=['get'], url_path='itens-disponiveis')
    def itens_disponiveis(self, request, pk=None):
        entidade = self.get_object()
        if entidade.tipo == 'pessoa':
            return Response(
                {'detail': 'Este perfil não é uma entidade.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        itens = ItemDoacao.objects.filter(
            receptor_confirmado=entidade,
            status__in=['disponivel', 'interessado'],
        ).order_by('-data_criacao')
        return Response(ItemDoacaoSerializer(
            itens, many=True, context={'request': request}
        ).data)

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
    filterset_fields = [
        'categoria', 'status', 'estado_conservacao', 'tipo_entrega',
        'data_disponibilidade', 'valor_contribuicao',
    ]
    search_fields = ['titulo', 'descricao']
    ordering_fields = ['data_criacao', 'quantidade']
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        valor_max = params.get('valor_max')
        data_ate = params.get('data_ate')
        if valor_max:
            if valor_max == '0':
                queryset = queryset.filter(
                    Q(valor_contribuicao__isnull=True) | Q(valor_contribuicao=0)
                )
            else:
                queryset = queryset.filter(
                    valor_contribuicao__isnull=False,
                    valor_contribuicao__lte=valor_max,
                )
        if data_ate:
            try:
                queryset = queryset.filter(data_disponibilidade__lte=date.fromisoformat(data_ate))
            except ValueError:
                pass
        if params.get('ponto_coleta') == 'sim':
            queryset = queryset.filter(ponto_coleta__isnull=False)

        lat, lon, distancia = params.get('lat'), params.get('lon'), params.get('distancia_km')
        if lat and lon and distancia:
            try:
                origem = (float(lat), float(lon))
                limite = float(distancia)
                ids = [
                    item.id for item in queryset.select_related('doador__usuario')
                    if item.doador.usuario.latitude is not None
                    and item.doador.usuario.longitude is not None
                    and haversine_distance(
                        origem[0], origem[1],
                        float(item.doador.usuario.latitude),
                        float(item.doador.usuario.longitude),
                    ) <= limite
                ]
                queryset = queryset.filter(id__in=ids)
            except (TypeError, ValueError):
                pass
        return queryset

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
        usuario = Usuario.objects.filter(user=request.user).first()
        if not usuario:
            return Response(
                {'error': 'Perfil de usuário não encontrado.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Repara perfis antigos que possuem Usuario como receptor, mas ficaram
        # sem o registro complementar Receptor após um cadastro interrompido.
        receptor, _ = Receptor.objects.get_or_create(
            usuario=usuario,
            defaults={
                'tipo': 'pessoa',
                'cnpj': f'PENDENTE{request.user.id}',
            },
        )
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

    @action(detail=False, methods=['get'])
    def meus_itens(self, request):
        try:
            doador = Doador.objects.get(usuario__user=request.user)
            itens = ItemDoacao.objects.filter(doador=doador)
            serializer = self.get_serializer(itens, many=True)
            return Response(serializer.data)
        except Doador.DoesNotExist:
            return Response({'error': 'Apenas doadores têm itens'}, status=status.HTTP_403_FORBIDDEN)


class EventoDoacaoViewSet(viewsets.ModelViewSet):
    queryset = EventoDoacao.objects.all()
    serializer_class = EventoDoacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['entidade_tipo', 'status']
    search_fields = ['titulo', 'descricao', 'entidade_nome', 'endereco']
    ordering_fields = ['data_inicio', 'data_criacao']

    def perform_create(self, serializer):
        usuario = Usuario.objects.get(user=self.request.user)
        serializer.save(organizador=usuario)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def meus_eventos(self, request):
        eventos = self.get_queryset().filter(organizador__user=request.user)
        return Response(self.get_serializer(eventos, many=True).data)


class InteresseViewSet(viewsets.ModelViewSet):
    serializer_class = InteresseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'item']

    def get_queryset(self):
        usuario = self.request.user
        return Interesse.objects.filter(
            Q(receptor__usuario__user=usuario)
            | Q(item__doador__usuario__user=usuario)
        ).distinct()

    def perform_create(self, serializer):
        usuario = Usuario.objects.filter(user=self.request.user).first()
        if not usuario:
            raise PermissionDenied(
                'Perfil de usuário não encontrado.'
            )

        receptor, _ = Receptor.objects.get_or_create(
            usuario=usuario,
            defaults={
                'tipo': 'pessoa',
                'cnpj': f'PENDENTE{self.request.user.id}',
            },
        )
        serializer.save(receptor=receptor)

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
    serializer_class = MensagemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['lida']
    ordering_fields = ['data_criacao']

    def get_queryset(self):
        usuario = self.request.user.perfil_doaperto
        return Mensagem.objects.filter(
            Q(remetente=usuario) | Q(destinatario=usuario)
        )

    def perform_create(self, serializer):
        serializer.save(remetente=self.request.user.perfil_doaperto)

    @action(detail=False, methods=['get'])
    def conversa(self, request):
        outro_usuario_id = request.query_params.get('usuario_id')
        if not outro_usuario_id:
            return Response({'error': 'usuario_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)

        usuario_atual = request.user.perfil_doaperto
        outro_usuario = Usuario.objects.filter(id=outro_usuario_id).first()
        if not outro_usuario:
            return Response({'error': 'Usuário destinatário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

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


class MatchingViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        receptor = Receptor.objects.filter(usuario__user=request.user).first()
        if not receptor:
            return Response(
                {'detail': 'Apenas receptores possuem recomendações de doação.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            limite = min(max(int(request.query_params.get('limite', 20)), 1), 50)
        except (TypeError, ValueError):
            limite = 20
        categorias = set(receptor.tipos_item_aceitos.values_list('id', flat=True))
        origem = (receptor.usuario.latitude, receptor.usuario.longitude)
        resultados = []

        itens = ItemDoacao.objects.filter(
            status__in=['disponivel', 'interessado']
        ).select_related('categoria', 'doador__usuario', 'ponto_coleta')
        for item in itens:
            score = 0
            motivos = []
            if item.categoria_id in categorias:
                score += 50
                motivos.append('categoria aceita pelo receptor')
            if item.tipo_entrega == 'retirada' and receptor.disponibilidade_retirada:
                score += 15
                motivos.append('retirada compatível')
            if item.valor_contribuicao in (None, 0):
                score += 10
                motivos.append('doação gratuita')

            distancia = None
            destino = (item.doador.usuario.latitude, item.doador.usuario.longitude)
            if all(value is not None for value in (*origem, *destino)):
                distancia = round(haversine_distance(
                    float(origem[0]), float(origem[1]),
                    float(destino[0]), float(destino[1]),
                ), 2)
                if distancia <= 5:
                    score += 25
                    motivos.append('doador próximo')
                elif distancia <= 20:
                    score += 10
                    motivos.append('doador na mesma região')

            if score:
                resultados.append({
                    'item': item,
                    'score': score,
                    'motivos': motivos,
                    'distancia_km': distancia,
                })

        resultados.sort(key=lambda result: (-result['score'], result['item'].data_criacao))
        serializer = MatchSerializer(resultados[:limite], many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def registro(request):
    logger = logging.getLogger(__name__)

    # Safely access parsed data and log any parsing errors/raw body
    try:
        data = request.data
    except Exception as e:
        raw = getattr(request, 'body', b'')
        logger.warning('registro parse error: %s; raw_body=%s', str(e), raw[:500])
        return Response({'detail': 'Corpo da requisição inválido'}, status=status.HTTP_400_BAD_REQUEST)

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name', '')
    tipo_conta = data.get('tipo', 'doador')
    entidade_tipo = data.get('entidade_tipo', 'ong')
    tipos_entidade = {
        'ong', 'igreja', 'escola', 'reciclagem',
        'academia', 'supermercado', 'associacao',
    }
    tipo = 'receptor' if tipo_conta in ['receptor', 'entidade'] else 'doador'

    if not username or not email or not password:
        logger.warning('registro missing fields: %s', data)
        return Response({'detail': 'username, email e password são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        logger.warning('registro username exists: %s; data=%s', username, data)
        return Response({'detail': 'Usuário já existe'}, status=status.HTTP_400_BAD_REQUEST)

    latitude = data.get('latitude') or None
    longitude = data.get('longitude') or None

    try:
        with transaction.atomic():
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name
            )

            usuario = Usuario.objects.create(
                user=user,
                tipo=tipo,
                endereco=data.get('endereco', '') if tipo == 'receptor' else '',
                latitude=latitude if tipo == 'receptor' else None,
                longitude=longitude if tipo == 'receptor' else None,
                aceite_termos=True,
            )

            if usuario.tipo == 'doador':
                Doador.objects.get_or_create(
                    usuario=usuario,
                    defaults={'cpf': f'{user.id:011d}'}
                )
            else:
                Receptor.objects.get_or_create(
                    usuario=usuario,
                    defaults={
                        'tipo': entidade_tipo if tipo_conta == 'entidade' and entidade_tipo in tipos_entidade else 'pessoa',
                        'cnpj': f'PENDENTE{user.id}',
                    }
                )

            refresh = RefreshToken.for_user(user)

        logger.info('registro success: username=%s id=%s', user.username, user.id)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'username': user.username,
                'email': user.email,
                'tipo': usuario.tipo,
                'entidade_tipo': (
                    usuario.receptor.tipo
                    if usuario.tipo == 'receptor' and usuario.receptor.tipo != 'pessoa'
                    else None
                ),
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.exception('registro exception: %s; data=%s', str(e), data)
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DoacaoViewSet(viewsets.ModelViewSet):
    queryset = Doacao.objects.all()
    serializer_class = DoacaoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]