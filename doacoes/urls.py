from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    DoacaoViewSet, CategoriaItemViewSet, UsuarioViewSet, DoadorViewSet,
    ReceptorViewSet, PontoColetaViewSet, ItemDoacaoViewSet,
    InteresseViewSet, MensagemViewSet, EventoDoacaoViewSet, registro
    , MatchingViewSet
)

router = DefaultRouter()
router.register(r'doacoes', DoacaoViewSet)
router.register(r'categorias', CategoriaItemViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'doadores', DoadorViewSet)
router.register(r'receptores', ReceptorViewSet)
router.register(r'pontos-coleta', PontoColetaViewSet)
router.register(r'itens-doacao', ItemDoacaoViewSet)
router.register(r'eventos-doacao', EventoDoacaoViewSet)
router.register(r'interesses', InteresseViewSet, basename='interesses')
router.register(r'mensagens', MensagemViewSet, basename='mensagens')
router.register(r'matches', MatchingViewSet, basename='matches')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/registro/', registro, name='registro'),
]