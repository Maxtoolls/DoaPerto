from rest_framework import serializers
from .models import Doacao

class DoacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doacao
        fields = '__all__'