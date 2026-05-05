from django.db import models
models_doacao.py

# models.py


class Doacao(models.Model):
    item = models.CharField(max_length=100)
    descricao = models.TextField()
    categoria = models.CharField(max_length=50)  # Ex: Alimento, Roupa
    quantidade = models.IntegerField()
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.item
