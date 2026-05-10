from rest_framework import viewsets
from .models import Doacao
from .serializers import DoacaoSerializer

class DoacaoViewSet(viewsets.ModelViewSet):
    queryset = Doacao.objects.all()
    serializer_class = DoacaoSerializer