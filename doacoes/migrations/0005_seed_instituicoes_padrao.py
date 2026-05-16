from django.contrib.auth.hashers import make_password
from django.db import migrations


INSTITUICOES_PADRAO = [
    {
        'username': 'ong_casa_aberta',
        'first_name': 'Casa Aberta',
        'email': 'contato@casaaberta.org.br',
        'tipo': 'ong',
        'cnpj': '00000000000001',
        'responsavel': 'Coordenação Casa Aberta',
        'telefone_contato': '(00) 90000-0001',
        'publico_atendido': 'Famílias em vulnerabilidade social e pessoas em situação de rua.',
        'horarios_disponibilidade': 'Segunda a sexta, 8h às 17h',
        'sobre': 'Instituição parceira voltada ao acolhimento e redistribuição de doações.',
    },
    {
        'username': 'igreja_vida_esperanca',
        'first_name': 'Vida e Esperança',
        'email': 'secretaria@vidaesperanca.org.br',
        'tipo': 'igreja',
        'cnpj': '00000000000002',
        'responsavel': 'Secretaria Vida e Esperança',
        'telefone_contato': '(00) 90000-0002',
        'publico_atendido': 'Comunidade local e famílias em apoio emergencial.',
        'horarios_disponibilidade': 'Terça a sábado, 9h às 18h',
        'sobre': 'Ponto de apoio comunitário para recebimento e distribuição de doações.',
    },
    {
        'username': 'escola_comunidade_viva',
        'first_name': 'Comunidade Viva',
        'email': 'direcao@comunidadeviva.edu.br',
        'tipo': 'escola',
        'cnpj': '00000000000003',
        'responsavel': 'Direção Comunidade Viva',
        'telefone_contato': '(00) 90000-0003',
        'publico_atendido': 'Estudantes e famílias atendidas pela escola e projetos sociais.',
        'horarios_disponibilidade': 'Segunda a sexta, 7h às 16h',
        'sobre': 'Escola com ações sociais para arrecadação e entrega de itens doados.',
    },
]


def create_instituicoes(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Usuario = apps.get_model('doacoes', 'Usuario')
    Receptor = apps.get_model('doacoes', 'Receptor')

    for instituicao in INSTITUICOES_PADRAO:
        user, created = User.objects.get_or_create(
            username=instituicao['username'],
            defaults={
                'first_name': instituicao['first_name'],
                'email': instituicao['email'],
                'password': make_password('senha123'),
            },
        )
        if created:
            user.save()

        usuario, _ = Usuario.objects.get_or_create(
            user=user,
            defaults={
                'tipo': 'receptor',
                'aceite_termos': True,
            },
        )

        Receptor.objects.get_or_create(
            usuario=usuario,
            defaults={
                'tipo': instituicao['tipo'],
                'cnpj': instituicao['cnpj'],
                'responsavel': instituicao['responsavel'],
                'telefone_contato': instituicao['telefone_contato'],
                'publico_atendido': instituicao['publico_atendido'],
                'disponibilidade_retirada': True,
                'horarios_disponibilidade': instituicao['horarios_disponibilidade'],
                'sobre': instituicao['sobre'],
                'ativo': True,
            },
        )


def delete_instituicoes(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    User.objects.filter(username__in=[instituicao['username'] for instituicao in INSTITUICOES_PADRAO]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('doacoes', '0004_seed_categorias_padrao'),
    ]

    operations = [
        migrations.RunPython(create_instituicoes, delete_instituicoes),
    ]