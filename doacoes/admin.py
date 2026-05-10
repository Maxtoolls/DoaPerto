from django.contrib import admin
from .models import (
    Doacao, CategoriaItem, Usuario, Doador, Receptor, PontoColeta,
    ItemDoacao, Interesse, Mensagem
)


@admin.register(Doacao)
class DoacaoAdmin(admin.ModelAdmin):
    list_display = ['item', 'categoria', 'quantidade', 'data_criacao']
    list_filter = ['categoria', 'data_criacao']
    search_fields = ['item', 'descricao']


@admin.register(CategoriaItem)
class CategoriaItemAdmin(admin.ModelAdmin):
    list_display = ['nome', 'data_criacao']
    search_fields = ['nome']


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['user', 'tipo', 'endereco', 'aceite_termos', 'data_criacao']
    list_filter = ['tipo', 'aceite_termos', 'data_criacao']
    search_fields = ['user__username', 'user__email', 'endereco']


@admin.register(Doador)
class DoadorAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'faixa_idade', 'faixa_renda', 'ativo', 'data_criacao']
    list_filter = ['faixa_idade', 'faixa_renda', 'ativo', 'data_criacao']
    search_fields = ['usuario__user__username', 'cpf']
    filter_horizontal = ['categorias_doacao']


@admin.register(Receptor)
class ReceptorAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'tipo', 'disponibilidade_retirada', 'ativo', 'data_criacao']
    list_filter = ['tipo', 'disponibilidade_retirada', 'ativo', 'data_criacao']
    search_fields = ['usuario__user__username', 'cnpj', 'responsavel']
    filter_horizontal = ['tipos_item_aceitos']


@admin.register(PontoColeta)
class PontoColetaAdmin(admin.ModelAdmin):
    list_display = ['nome', 'tipo', 'endereco', 'ativo', 'data_criacao']
    list_filter = ['tipo', 'ativo', 'data_criacao']
    search_fields = ['nome', 'endereco', 'email']
    filter_horizontal = ['tipos_item_aceitos']


@admin.register(ItemDoacao)
class ItemDoacaoAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'doador', 'categoria', 'status', 'quantidade', 'data_criacao']
    list_filter = ['status', 'categoria', 'data_criacao']
    search_fields = ['titulo', 'descricao', 'doador__usuario__user__username']
    readonly_fields = ['data_criacao']


@admin.register(Interesse)
class InteresseAdmin(admin.ModelAdmin):
    list_display = ['receptor', 'item', 'status', 'data_criacao']
    list_filter = ['status', 'data_criacao']
    search_fields = ['receptor__usuario__user__username', 'item__titulo']


@admin.register(Mensagem)
class MensagemAdmin(admin.ModelAdmin):
    list_display = ['remetente', 'destinatario', 'lida', 'data_criacao']
    list_filter = ['lida', 'data_criacao']
    search_fields = ['remetente__user__username', 'destinatario__user__username', 'conteudo']
    readonly_fields = ['data_criacao']
