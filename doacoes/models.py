from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class CategoriaItem(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    descricao = models.TextField(blank=True)
    icone = models.CharField(max_length=50, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categorias de Itens"
        ordering = ['nome']

    def __str__(self):
        return self.nome


class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil_doaperto')
    tipo = models.CharField(
        max_length=20,
        choices=[('doador', 'Doador'), ('receptor', 'Receptor')],
        default='doador'
    )
    telefone = models.CharField(max_length=20, blank=True)
    endereco = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    aceite_termos = models.BooleanField(default=False)
    data_consentimento = models.DateTimeField(null=True, blank=True)
    deseja_delecao = models.BooleanField(default=False)
    referido_por = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Usuários"
        ordering = ['-data_criacao']

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.tipo})"


class Doador(models.Model):
    FAIXA_RENDA = [
        ('0-1000', 'Até R$ 1.000'),
        ('1000-3000', 'R$ 1.000 - R$ 3.000'),
        ('3000-5000', 'R$ 3.000 - R$ 5.000'),
        ('5000+', 'Acima de R$ 5.000'),
    ]
    FAIXA_IDADE = [
        ('18-25', '18-25 anos'),
        ('25-35', '25-35 anos'),
        ('35-50', '35-50 anos'),
        ('50+', '50+ anos'),
    ]

    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='doador')
    cpf = models.CharField(max_length=14, unique=True)
    faixa_idade = models.CharField(max_length=20, choices=FAIXA_IDADE, blank=True)
    faixa_renda = models.CharField(max_length=20, choices=FAIXA_RENDA, blank=True)
    categorias_doacao = models.ManyToManyField(CategoriaItem, blank=True)
    biografia = models.TextField(blank=True, max_length=500)
    foto_perfil = models.CharField(max_length=255, blank=True)
    ativo = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Doadores"
        ordering = ['-data_criacao']

    def __str__(self):
        return f"Doador: {self.usuario.user.get_full_name()}"


class Receptor(models.Model):
    TIPO_RECEPTOR = [
        ('pessoa', 'Pessoa Física'),
        ('ong', 'ONG'),
        ('igreja', 'Igreja'),
        ('escola', 'Escola'),
        ('reciclagem', 'Ponto de Reciclagem'),
    ]

    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='receptor')
    tipo = models.CharField(max_length=50, choices=TIPO_RECEPTOR)
    cnpj = models.CharField(max_length=18, blank=True, unique=True)
    responsavel = models.CharField(max_length=150, blank=True)
    telefone_contato = models.CharField(max_length=20, blank=True)
    publico_atendido = models.TextField(blank=True)
    tipos_item_aceitos = models.ManyToManyField(CategoriaItem, blank=True)
    disponibilidade_retirada = models.BooleanField(default=False)
    horarios_disponibilidade = models.CharField(max_length=255, blank=True)
    sobre = models.TextField(blank=True, max_length=1000)
    ativo = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Receptores"
        ordering = ['-data_criacao']

    def __str__(self):
        return f"Receptor ({self.tipo}): {self.usuario.user.get_full_name()}"


class PontoColeta(models.Model):
    TIPO_PONTO = [
        ('ong', 'ONG'),
        ('igreja', 'Igreja'),
        ('escola', 'Escola'),
        ('reciclagem', 'Reciclagem'),
        ('outro', 'Outro'),
    ]

    nome = models.CharField(max_length=200)
    tipo = models.CharField(max_length=50, choices=TIPO_PONTO)
    endereco = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    telefone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    horarios = models.TextField(blank=True)
    tipos_item_aceitos = models.ManyToManyField(CategoriaItem, blank=True)
    capacidade_armazenamento = models.CharField(max_length=100, blank=True)
    responsavel = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    ativo = models.BooleanField(default=True)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Pontos de Coleta"
        ordering = ['-data_criacao']

    def __str__(self):
        return f"{self.nome} ({self.get_tipo_display()})"


class ItemDoacao(models.Model):
    STATUS = [
        ('disponivel', 'Disponível'),
        ('interessado', 'Com Interessado'),
        ('doado', 'Doado'),
        ('cancelado', 'Cancelado'),
    ]

    doador = models.ForeignKey(Doador, on_delete=models.CASCADE, related_name='itens_doacao')
    categoria = models.ForeignKey(CategoriaItem, on_delete=models.SET_NULL, null=True)
    titulo = models.CharField(max_length=150)
    descricao = models.TextField()
    quantidade = models.IntegerField(validators=[MinValueValidator(1)])
    unidade = models.CharField(max_length=50, default='unidade')
    status = models.CharField(max_length=20, choices=STATUS, default='disponivel')
    receptor_confirmado = models.ForeignKey(Receptor, on_delete=models.SET_NULL, null=True, blank=True)
    ponto_coleta = models.ForeignKey(PontoColeta, on_delete=models.SET_NULL, null=True, blank=True)
    pode_retirar_diretamente = models.BooleanField(default=True)
    imagem = models.CharField(max_length=255, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_expiracao = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Itens de Doação"
        ordering = ['-data_criacao']

    def __str__(self):
        return f"{self.titulo} - {self.doador.usuario.user.get_full_name()}"


class Interesse(models.Model):
    STATUS_INTERESSE = [
        ('interesse', 'Interessado'),
        ('confirmado', 'Confirmado'),
        ('cancelado', 'Cancelado'),
        ('finalizado', 'Finalizado'),
    ]

    item = models.ForeignKey(ItemDoacao, on_delete=models.CASCADE, related_name='interesses')
    receptor = models.ForeignKey(Receptor, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_INTERESSE, default='interesse')
    mensagem_inicial = models.TextField(blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Interesses"
        unique_together = ['item', 'receptor']
        ordering = ['-data_criacao']

    def __str__(self):
        return f"{self.receptor.usuario.user.username} → {self.item.titulo}"


class Mensagem(models.Model):
    remetente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='mensagens_enviadas')
    destinatario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='mensagens_recebidas')
    interesse = models.ForeignKey(Interesse, on_delete=models.CASCADE, null=True, blank=True)
    conteudo = models.TextField()
    lida = models.BooleanField(default=False)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Mensagens"
        ordering = ['data_criacao']
        indexes = [
            models.Index(fields=['remetente', 'data_criacao']),
            models.Index(fields=['destinatario', 'lida']),
        ]

    def __str__(self):
        return f"{self.remetente.user.username} → {self.destinatario.user.username}"