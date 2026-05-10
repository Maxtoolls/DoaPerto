from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Doacao, CategoriaItem, Usuario, Doador, Receptor, PontoColeta,
    ItemDoacao, Interesse, Mensagem
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

    class Meta:
        model = Usuario
        fields = [
            'id', 'user', 'tipo', 'telefone', 'endereco',
            'latitude', 'longitude', 'aceite_termos',
            'data_consentimento', 'referido_por'
        ]
        read_only_fields = ['id', 'data_criacao', 'data_atualizacao']


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


class ItemDoacaoSerializer(serializers.ModelSerializer):
    doador_nome = serializers.CharField(
        source='doador.usuario.user.get_full_name',
        read_only=True
    )
    categoria_nome = serializers.CharField(
        source='categoria.nome',
        read_only=True
    )

    class Meta:
        model = ItemDoacao
        fields = [
            'id', 'doador', 'doador_nome', 'categoria', 'categoria_nome',
            'titulo', 'descricao', 'quantidade', 'unidade', 'status',
            'receptor_confirmado', 'ponto_coleta', 'pode_retirar_diretamente',
            'imagem', 'data_criacao', 'data_expiracao'
        ]
        read_only_fields = ['id', 'data_criacao', 'status']


class InteresseSerializer(serializers.ModelSerializer):
    item_titulo = serializers.CharField(source='item.titulo', read_only=True)
    receptor_nome = serializers.CharField(
        source='receptor.usuario.user.get_full_name',
        read_only=True
    )

    class Meta:
        model = Interesse
        fields = [
            'id', 'item', 'item_titulo', 'receptor', 'receptor_nome',
            'status', 'mensagem_inicial', 'data_criacao', 'data_atualizacao'
        ]
        read_only_fields = ['id', 'data_criacao', 'data_atualizacao']


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


class DoacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doacao
        fields = '__all__'