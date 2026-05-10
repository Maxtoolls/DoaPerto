from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    DoacaoViewSet, CategoriaItemViewSet, UsuarioViewSet, DoadorViewSet,
    ReceptorViewSet, PontoColetaViewSet, ItemDoacaoViewSet,
    InteresseViewSet, MensagemViewSet
)

router = DefaultRouter()
router.register(r'doacoes', DoacaoViewSet)
router.register(r'categorias', CategoriaItemViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'doadores', DoadorViewSet)
router.register(r'receptores', ReceptorViewSet)
router.register(r'pontos-coleta', PontoColetaViewSet)
router.register(r'itens-doacao', ItemDoacaoViewSet)
router.register(r'interesses', InteresseViewSet)
router.register(r'mensagens', MensagemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]