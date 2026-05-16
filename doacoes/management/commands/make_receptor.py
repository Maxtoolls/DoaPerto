from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from doacoes.models import Usuario, Receptor


class Command(BaseCommand):
    help = 'Create or ensure a Receptor profile for an existing user (by username).'

    def add_arguments(self, parser):
        parser.add_argument('username', help='Username of the existing user')

    def handle(self, *args, **options):
        username = options['username']
        User = get_user_model()
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stderr.write(self.style.ERROR(f'User "{username}" not found.'))
            return

        usuario, u_created = Usuario.objects.get_or_create(
            user=user,
            defaults={
                'tipo': 'receptor',
            }
        )

        receptor, r_created = Receptor.objects.get_or_create(
            usuario=usuario,
            defaults={
                # adjust defaults as your Receptor model expects
            }
        )

        if u_created:
            self.stdout.write(self.style.SUCCESS(f'Created Usuario record for {username} (id={usuario.id}).'))
        else:
            self.stdout.write(f'Usuario record already exists for {username} (id={usuario.id}).')

        if r_created:
            self.stdout.write(self.style.SUCCESS(f'Created Receptor for {username} (id={receptor.id}).'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Receptor already exists for {username} (id={receptor.id}).'))
