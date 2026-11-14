from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doacoes', '0005_seed_instituicoes_padrao'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemdoacao',
            name='data_disponibilidade',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='itemdoacao',
            name='estado_conservacao',
            field=models.CharField(
                choices=[('novo', 'Novo'), ('seminovo', 'Seminovo'), ('usado', 'Usado')],
                default='usado',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='itemdoacao',
            name='tipo_entrega',
            field=models.CharField(
                choices=[
                    ('retirada', 'Retirada presencial'),
                    ('entrega_gratis', 'Entrega grátis'),
                    ('taxa_combinada', 'Taxa combinada'),
                ],
                default='retirada',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='itemdoacao',
            name='valor_contribuicao',
            field=models.DecimalField(
                blank=True, decimal_places=2, max_digits=10, null=True
            ),
        ),
    ]
