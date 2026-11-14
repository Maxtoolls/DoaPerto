from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('doacoes', '0006_itemdoacao_advanced_filters'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventoDoacao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entidade_nome', models.CharField(max_length=200)),
                ('entidade_tipo', models.CharField(choices=[
                    ('academia', 'Academia'), ('ong', 'ONG'),
                    ('supermercado', 'Supermercado'), ('associacao', 'Associação'),
                    ('igreja', 'Igreja'), ('outro', 'Outra entidade'),
                ], max_length=30)),
                ('titulo', models.CharField(max_length=200)),
                ('descricao', models.TextField()),
                ('endereco', models.CharField(max_length=255)),
                ('latitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('longitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('data_inicio', models.DateTimeField()),
                ('data_fim', models.DateTimeField()),
                ('horario', models.CharField(blank=True, max_length=100)),
                ('capacidade', models.CharField(blank=True, max_length=100)),
                ('status', models.CharField(choices=[
                    ('planejado', 'Planejado'), ('aberto', 'Recebendo doações'),
                    ('encerrado', 'Encerrado'),
                ], default='planejado', max_length=20)),
                ('data_criacao', models.DateTimeField(auto_now_add=True)),
                ('categorias', models.ManyToManyField(blank=True, to='doacoes.categoriaitem')),
                ('organizador', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='eventos_doacao',
                    to='doacoes.usuario',
                )),
            ],
            options={
                'verbose_name': 'Evento de doação',
                'verbose_name_plural': 'Eventos de doação',
                'ordering': ['data_inicio'],
            },
        ),
    ]
