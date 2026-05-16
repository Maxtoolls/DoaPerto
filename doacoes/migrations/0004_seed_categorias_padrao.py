from django.db import migrations


CATEGORIAS_PADRAO = [
    {
        'nome': 'Alimentos não perecíveis',
        'descricao': 'Arroz, feijão, macarrão, enlatados, leite em pó e itens básicos para cestas.',
        'icone': 'food',
    },
    {
        'nome': 'Higiene pessoal',
        'descricao': 'Sabonete, pasta de dente, escova de dente, shampoo, desodorante e absorventes.',
        'icone': 'hygiene',
    },
    {
        'nome': 'Produtos de limpeza',
        'descricao': 'Sabão, detergente, água sanitária, desinfetante, esponjas e afins.',
        'icone': 'cleaning',
    },
    {
        'nome': 'Roupas',
        'descricao': 'Peças novas ou em bom estado para crianças, adultos e idosos.',
        'icone': 'clothing',
    },
    {
        'nome': 'Calçados',
        'descricao': 'Tênis, sandálias, sapatos e chinelos em bom estado.',
        'icone': 'shoes',
    },
    {
        'nome': 'Cobertores e roupas de cama',
        'descricao': 'Cobertores, lençóis, travesseiros e mantas para acolhimento.',
        'icone': 'bedding',
    },
    {
        'nome': 'Itens para bebês',
        'descricao': 'Fraldas, roupinhas, mamadeiras, mantas e outros itens infantis.',
        'icone': 'baby',
    },
    {
        'nome': 'Material escolar',
        'descricao': 'Cadernos, mochilas, lápis, canetas, estojos e outros materiais de estudo.',
        'icone': 'school',
    },
    {
        'nome': 'Livros e revistas',
        'descricao': 'Livros literários, didáticos, gibis e revistas em bom estado.',
        'icone': 'books',
    },
    {
        'nome': 'Brinquedos',
        'descricao': 'Brinquedos educativos, jogos, bonecas, carrinhos e itens recreativos.',
        'icone': 'toys',
    },
    {
        'nome': 'Utensílios domésticos',
        'descricao': 'Pratos, copos, panelas, talheres, baldes e outros utilitários.',
        'icone': 'home',
    },
    {
        'nome': 'Móveis',
        'descricao': 'Mesas, cadeiras, camas, armários e itens de mobiliário reutilizáveis.',
        'icone': 'furniture',
    },
    {
        'nome': 'Eletrônicos e acessórios',
        'descricao': 'Celulares, carregadores, fones, computadores e periféricos.',
        'icone': 'electronics',
    },
    {
        'nome': 'Outros',
        'descricao': 'Itens que não se encaixam nas categorias anteriores, mas ainda podem ser doados.',
        'icone': 'other',
    },
]


def create_categorias(apps, schema_editor):
    CategoriaItem = apps.get_model('doacoes', 'CategoriaItem')

    for categoria in CATEGORIAS_PADRAO:
        CategoriaItem.objects.get_or_create(
            nome=categoria['nome'],
            defaults={
                'descricao': categoria['descricao'],
                'icone': categoria['icone'],
            },
        )


def delete_categorias(apps, schema_editor):
    CategoriaItem = apps.get_model('doacoes', 'CategoriaItem')
    CategoriaItem.objects.filter(nome__in=[categoria['nome'] for categoria in CATEGORIAS_PADRAO]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('doacoes', '0003_doacao'),
    ]

    operations = [
        migrations.RunPython(create_categorias, delete_categorias),
    ]