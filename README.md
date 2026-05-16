# DoaPerto - Sistema de Doações P2P

Sistema de doações com geolocalização conectando doadores com receptores.

## Stack
- **Backend:** Django 4.2 + Django REST Framework + JWT
- **Frontend:** React 18 + Vite + Leaflet
- **Database:** SQLite
- **Package Manager:** uv (Python), npm (Node.js)

## Principais alterações recentes
- `make_receptor` management command (cria/garante `Receptor` para um `Usuario`).
- `registro` API agora aceita `tipo` ("doador" ou "receptor") e cria o perfil correspondente.
- `ItemDoacaoSerializer` expõe `interesses` para que o doador veja quem manifestou interesse.
- Frontend: telas de `Registro` com botões "Sou doador" / "Sou receptor"; `Meus Itens` mostra interessados inline; `Expressar Interesse` página/ação.

## Infraestrutura (Docker + CI)
Adicionei uma infraestrutura mínima para desenvolvimento e integração contínua:

- `Dockerfile` (raiz) — container de desenvolvimento para o backend (executa `manage.py runserver`).
- `frontend/Dockerfile` — container para o frontend usando Vite.
- `docker-compose.yml` — orquestra `web` (Django) e `frontend` (Vite) para desenvolvimento;
- `.env.example` — variáveis de ambiente de exemplo.
- `.github/workflows/ci.yml` — workflow CI básico que instala dependências, executa `manage.py check/migrate` e build do frontend.

Rodando com Docker Compose (desenvolvimento):

```bash
# constrói containers e inicia backend (8000) e frontend (5173)
docker-compose up --build

# acessar frontend: http://localhost:5173
# acessar API: http://localhost:8000/api/
```

Observações:
- O `VITE_API_URL` do `frontend` em compose aponta para `http://web:8000/api` (host do serviço `web`).
- Usamos SQLite atualmente; para produção, substitua por Postgres e ajuste `docker-compose.yml`.


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
   - Também é possível indicar o tipo no registro: a tela de registro agora tem botões "Sou doador" / "Sou receptor" e o backend criará automaticamente o perfil correspondente.

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

Para uso com `docker-compose` copie `.env.example`:

```bash
cp .env.example .env
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
