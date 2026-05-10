# DoaPerto - Sistema de Doações P2P

Sistema de doações com geolocalização conectando doadores com receptores.

## Stack
- **Backend:** Django 4.2 + Django REST Framework + JWT
- **Frontend:** React 18 + Vite + Leaflet
- **Database:** SQLite
- **Package Manager:** uv (Python), npm (Node.js)

## Instalação

### Backend
```bash
cd /path/to/DoaPerto
uv sync
uv run python manage.py migrate
uv run python manage.py createsuperuser  # Opcional
```

### Frontend
```bash
cd frontend
npm install
```

## Como Rodar

### Terminal 1 - Django Server
```bash
cd /path/to/DoaPerto
uv run python manage.py runserver
# Server em: http://localhost:8000
# Admin: http://localhost:8000/admin
# API: http://localhost:8000/api/
```

### Terminal 2 - React Dev Server
```bash
cd /path/to/DoaPerto/frontend
npm run dev
# Frontend em: http://localhost:5173
```

## Endpoints da API

### Autenticação
- `POST /api/token/` - Obter tokens JWT
- `POST /api/token/refresh/` - Renovar token

### Recursos
- `GET /api/categorias/` - Listar categorias
- `GET/POST /api/doadores/` - Doadores
- `GET/POST /api/receptores/` - Receptores
- `GET/POST /api/pontos-coleta/` - Pontos de coleta
- `GET/POST /api/itens-doacao/` - Itens para doação
- `GET/POST /api/mensagens/` - Mensagens
- `GET/POST /api/interesses/` - Expressar interesse

### Filtros Geográficos
- `GET /api/doadores/proximos/?lat=X&lon=Y&km=10`
- `GET /api/receptores/proximos/?lat=X&lon=Y&km=10`
- `GET /api/pontos-coleta/proximos/?lat=X&lon=Y&km=10`

## Estrutura de Dados

### Modelos Principais
- **Usuario** - Usuário base (estende Django User)
- **Doador** - Pessoa que doa (FK Usuario)
- **Receptor** - Pessoa/ONG que recebe (FK Usuario)
- **PontoColeta** - Local de coleta
- **ItemDoacao** - Item disponível para doação
- **Interesse** - Interesse do receptor em um item
- **Mensagem** - Chat entre usuários

## Funcionalidades

### Fase 1 ✅ (Completa)
- [x] Models de banco de dados
- [x] API REST completa
- [x] Autenticação JWT
- [x] CORS configurado
- [x] Admin Django

### Fase 2 ✅ (Completa)
- [x] Frontend React com Vite
- [x] Páginas: Home, Login, Registro
- [x] Cadastro de Doador e Receptor
- [x] Mapa com Leaflet
- [x] Componentes reutilizáveis

### Fase 3 (MVP Features)
- [ ] Geolocalização completa do usuário
- [ ] Listagem com filtros avançados
- [ ] Chat em tempo real (WebSockets)
- [ ] Sistema de matching doador-receptor
- [ ] Upload de imagens

### Fase 4 (UX Completa)
- [ ] Jornada de 5 etapas da persona
- [ ] Sistema de referral/indicação
- [ ] Notificações
- [ ] Histórico de transações
- [ ] Ratings/Avaliações

## LGPD Compliance
- ✅ Consentimento explícito de dados
- ✅ Mascaramento de CPF/CNPJ
- ✅ Campo para deleção de dados
- ⏳ Implementar soft delete e anonimização

## Como Testar

1. **Registre um usuário:**
   - Acesse http://localhost:5173/registro
   - Preencha dados e confirme

2. **Cadastre como Doador/Receptor:**
   - Após login, clique em "Ser Doador" ou "Ser Receptor"
   - Complete o formulário

3. **Veja o mapa:**
   - Acesse a página de Mapa
   - Permita localização do navegador
   - Veja pontos de coleta próximos

4. **Teste a API diretamente:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/categorias/
   ```

## Variáveis de Ambiente

Criar arquivo `.env` na raiz do projeto (opcional):
```env
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Deploy

Para produção:
```bash
# Backend
pip install -r requirements.txt  # Gerado de uv.lock
python manage.py collectstatic
gunicorn doaperto.wsgi

# Frontend
npm run build
# Servir pasta 'dist'
```

## Suporte

Qualquer dúvida, abra uma issue no repositório.
