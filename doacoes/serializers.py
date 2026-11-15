from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Doacao, CategoriaItem, Usuario, Doador, Receptor, PontoColeta,
    ItemDoacao, Interesse, Mensagem, EventoDoacao
)


class CategoriaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaItem
        fields = ['id', 'nome', 'descricao', 'icone']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UsuarioSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    pode_configurar_localizacao = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            'id', 'user', 'tipo', 'telefone', 'endereco',
            'latitude', 'longitude', 'aceite_termos',
            'data_consentimento', 'referido_por', 'pode_configurar_localizacao'
        ]
        read_only_fields = [
            'id', 'data_criacao', 'data_atualizacao',
            'pode_configurar_localizacao',
        ]

    def get_pode_configurar_localizacao(self, obj):
        receptor = getattr(obj, 'receptor', None)
        return obj.tipo == 'receptor' and receptor is not None and receptor.tipo != 'pessoa'


class DoadorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    categorias_doacao = CategoriaItemSerializer(many=True, read_only=True)
    categorias_doacao_ids = serializers.PrimaryKeyRelatedField(
        queryset=CategoriaItem.objects.all(),
        many=True,
        source='categorias_doacao',
        write_only=True
    )

    class Meta:
        model = Doador
        fields = [
            'id', 'usuario', 'cpf', 'faixa_idade', 'faixa_renda',
            'categorias_doacao', 'categorias_doacao_ids',
            'biografia', 'foto_perfil', 'ativo'
        ]
        read_only_fields = ['id', 'data_criacao']
        extra_kwargs = {
            'cpf': {'write_only': True}
        }


class ReceptorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    tipos_item_aceitos = CategoriaItemSerializer(many=True, read_only=True)
    tipos_item_aceitos_ids = serializers.PrimaryKeyRelatedField(
        queryset=CategoriaItem.objects.all(),
        many=True,
        source='tipos_item_aceitos',
        write_only=True
    )

    class Meta:
        model = Receptor
        fields = [
            'id', 'usuario', 'tipo', 'cnpj', 'responsavel',
            'telefone_contato', 'publico_atendido',
            'tipos_item_aceitos', 'tipos_item_aceitos_ids',
            'disponibilidade_retirada', 'horarios_disponibilidade',
            'sobre', 'ativo'
        ]
        read_only_fields = ['id', 'data_criacao']
        extra_kwargs = {
            'cnpj': {'write_only': True}
        }


class EntidadeSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    categorias_aceitas = CategoriaItemSerializer(
        source='tipos_item_aceitos', many=True, read_only=True
    )
    itens_disponiveis = serializers.SerializerMethodField()

    class Meta:
        model = Receptor
        fields = [
            'id', 'usuario', 'tipo', 'responsavel', 'telefone_contato',
            'publico_atendido', 'categorias_aceitas',
            'disponibilidade_retirada', 'horarios_disponibilidade',
            'sobre', 'itens_disponiveis',
        ]

    def get_itens_disponiveis(self, entidade):
        itens = ItemDoacao.objects.filter(
            receptor_confirmado=entidade,
            status__in=['disponivel', 'interessado'],
        ).order_by('-data_criacao')
        return ItemDoacaoSerializer(
            itens, many=True, context=self.context
        ).data


class PontoColetaSerializer(serializers.ModelSerializer):
    tipos_item_aceitos = CategoriaItemSerializer(many=True, read_only=True)
    tipos_item_aceitos_ids = serializers.PrimaryKeyRelatedField(
        queryset=CategoriaItem.objects.all(),
        many=True,
        source='tipos_item_aceitos',
        write_only=True
    )
    responsavel_username = serializers.CharField(
        source='responsavel.user.username',
        read_only=True
    )

    class Meta:
        model = PontoColeta
        fields = [
            'id', 'nome', 'tipo', 'endereco', 'latitude', 'longitude',
            'telefone', 'email', 'horarios', 'tipos_item_aceitos',
            'tipos_item_aceitos_ids', 'capacidade_armazenamento',
            'responsavel', 'responsavel_username', 'ativo'
        ]
        read_only_fields = ['id', 'data_criacao', 'responsavel_username']


class EventoDoacaoSerializer(serializers.ModelSerializer):
    organizador_nome = serializers.CharField(
        source='organizador.user.get_full_name', read_only=True
    )
    categorias = CategoriaItemSerializer(many=True, read_only=True)
    categorias_ids = serializers.PrimaryKeyRelatedField(
        queryset=CategoriaItem.objects.all(),
        many=True,
        source='categorias',
        write_only=True,
        required=False,
    )

    class Meta:
        model = EventoDoacao
        fields = [
            'id', 'organizador', 'organizador_nome', 'entidade_nome',
            'entidade_tipo', 'titulo', 'descricao', 'endereco', 'latitude',
            'longitude', 'data_inicio', 'data_fim', 'horario', 'capacidade',
            'status', 'categorias', 'categorias_ids', 'data_criacao',
        ]
        read_only_fields = ['id', 'organizador', 'organizador_nome', 'data_criacao']


class InteresseSerializer(serializers.ModelSerializer):
    item_titulo = serializers.CharField(source='item.titulo', read_only=True)
    receptor_nome = serializers.CharField(
        source='receptor.usuario.user.get_full_name',
        read_only=True
    )
    receptor_email = serializers.EmailField(
        source='receptor.usuario.user.email', read_only=True
    )
    receptor_telefone = serializers.SerializerMethodField()
    receptor_endereco = serializers.CharField(
        source='receptor.usuario.endereco', read_only=True
    )
    receptor_tipo = serializers.CharField(source='receptor.tipo', read_only=True)
    receptor_responsavel = serializers.CharField(
        source='receptor.responsavel', read_only=True
    )
    item_doador_nome = serializers.CharField(
        source='item.doador.usuario.user.get_full_name',
        read_only=True
    )
    receptor_usuario_id = serializers.IntegerField(
        source='receptor.usuario_id', read_only=True
    )
    item_doador_usuario_id = serializers.IntegerField(
        source='item.doador.usuario_id', read_only=True
    )

    class Meta:
        model = Interesse
        fields = [
            'id', 'item', 'item_titulo', 'item_doador_nome', 'receptor', 'receptor_nome',
            'receptor_email', 'receptor_telefone', 'receptor_endereco',
            'receptor_tipo', 'receptor_responsavel',
            'receptor_usuario_id', 'item_doador_usuario_id',
            'status', 'mensagem_inicial', 'data_criacao', 'data_atualizacao'
        ]
        read_only_fields = ['id', 'data_criacao', 'data_atualizacao']

    def get_receptor_telefone(self, interesse):
        return (
            interesse.receptor.telefone_contato
            or interesse.receptor.usuario.telefone
        )


class ItemDoacaoSerializer(serializers.ModelSerializer):
    doador_nome = serializers.CharField(
        source='doador.usuario.user.get_full_name',
        read_only=True
    )
    categoria_nome = serializers.CharField(
        source='categoria.nome',
        read_only=True
    )
    receptor_confirmado_nome = serializers.CharField(
        source='receptor_confirmado.usuario.user.get_full_name',
        read_only=True
    )
    ponto_coleta_nome = serializers.CharField(
        source='ponto_coleta.nome',
        read_only=True
    )
    interesses = serializers.SerializerMethodField()

    class Meta:
        model = ItemDoacao
        fields = [
            'id', 'doador', 'doador_nome', 'categoria', 'categoria_nome',
            'titulo', 'descricao', 'quantidade', 'unidade', 'status',
            'estado_conservacao', 'valor_contribuicao', 'data_disponibilidade',
            'tipo_entrega',
            'receptor_confirmado', 'receptor_confirmado_nome',
            'ponto_coleta', 'ponto_coleta_nome', 'pode_retirar_diretamente',
                'imagem', 'data_criacao', 'data_expiracao', 'interesses'
        ]
        read_only_fields = ['id', 'data_criacao', 'status', 'doador']

    def get_interesses(self, item):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return []

        pode_visualizar = (
            item.doador.usuario.user_id == user.id
            or Interesse.objects.filter(
                item=item, receptor__usuario__user=user
            ).exists()
        )
        if not pode_visualizar:
            return []
        return InteresseSerializer(
            item.interesses.all(),
            many=True,
            context=self.context,
        ).data


class MensagemSerializer(serializers.ModelSerializer):
    remetente_nome = serializers.CharField(
        source='remetente.user.get_full_name',
        read_only=True
    )
    destinatario_nome = serializers.CharField(
        source='destinatario.user.get_full_name',
        read_only=True
    )

    class Meta:
        model = Mensagem
        fields = [
            'id', 'remetente', 'remetente_nome', 'destinatario',
            'destinatario_nome', 'interesse', 'conteudo', 'lida',
            'data_criacao'
        ]
        read_only_fields = ['id', 'data_criacao']


class MatchSerializer(serializers.Serializer):
    item = ItemDoacaoSerializer(read_only=True)
    score = serializers.IntegerField()
    motivos = serializers.ListField(child=serializers.CharField())
    distancia_km = serializers.FloatField(allow_null=True)


class DoacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doacao
        fields = '__all__'