# DoaPerto - Sistema de Doações P2P

Sistema de doações com geolocalização conectando doadores com receptores. A jornada escolhida como exemplo do desenvolvimento foi a de Lucas Pereira.
que ilustra bem a dinâmica de praticidade, conscientização e interação entre pessoas que precisa e doadores.


<img width="1269" height="496" alt="Captura de tela de 2026-05-18 22-00-39" src="https://github.com/user-attachments/assets/71afde12-16b6-4756-af5c-00e6562ea2d6" />

## Personas e Jornadas consideradas no projeto (Atualização para novas funcionalidades)

<img width="2800" height="1318" alt="eac2f3f5-59ce-4ac5-85bb-e8e6d33ba77d" src="https://github.com/user-attachments/assets/c5527525-54b6-4bda-82c7-936b5ad87b25" />






## Stack
- **Backend:** Django 4.2 + Django REST Framework + JWT
- **Frontend:** React 18 + Vite + Leaflet
- **Database:** SQLite
- **Package Manager:** uv (Python), npm (Node.js)

## Principais alterações recentes
- `make_receptor` management command (cria/garante `Receptor` para um `Usuario`).
- `registro` API agora aceita `tipo` ("doador" ou "receptor") e cria o perfil correspondente.
- `ItemDoacaoSerializer` expõe `interesses` para que o doador veja quem manifestou interesse.
- Cada interesse exibe nome, tipo, e-mail, telefone e endereço do receptor autorizado a visualizar o item.
- O endpoint de interesse valida o perfil autenticado e recupera automaticamente perfis
  receptores antigos que ficaram sem o registro complementar.
- O cadastro de receptor aceita endereço sem exigir coordenadas; latitude e longitude
  são opcionais e ficam como `null` até a entidade ou receptor informar sua localização.
- Frontend: telas de `Registro` com botões "Sou doador" / "Sou receptor"; `Meus Itens` mostra interessados inline; `Expressar Interesse` página/ação.

## Melhorias de UX baseadas nas personas

As jornadas descritas no projeto integrador orientaram uma atualização visual e funcional
sem alterar os endpoints existentes:

- **Receptores (Beatriz):** a tela **Explorar** agora combina busca por palavra-chave,
  categoria e disponibilidade. Isso reduz resultados irrelevantes e facilita encontrar
  itens específicos, como material escolar, sem expor dados sensíveis.
- **Doadores (Marcelo e Juliana):** a navegação ganhou hierarquia mais clara e a
  experiência mantém o fluxo de publicação, acompanhamento de interessados e escolha de
  destino da doação.
- **Pontos de coleta (Rafael):** o acesso a **Explorar** permanece destacado e a
  identidade visual reforça localização, confiança e organização da entrega.
- **Todos os perfis:** o layout foi modernizado com contraste acessível, estados vazios
  orientativos, foco visível em campos e adaptação para telas pequenas.

Os filtros avançados agora disponíveis em **Explorar** são: palavra-chave, categoria,
status, estado de conservação, contribuição voluntária máxima, data limite para retirada,
tipo de entrega, ponto de coleta e distância. A distância solicita a localização do
navegador e considera a localização cadastrada do doador. Ao publicar um item, o doador
também pode informar conservação, contribuição, data e modalidade de entrega.

### Como usar a busca de doações

1. Acesse **Explorar**.
2. Digite um termo (título ou descrição), escolha uma categoria e selecione o status.
3. Use **Expressar Interesse** para iniciar o contato. O envio continua exigindo login,
   preservando a proteção do fluxo atual.

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

## Infraestrutura - Guia Rápido
Pré-requisitos: `docker`, `docker-compose` (ou `docker compose`), `git`.

1) Copie variáveis de ambiente de exemplo:

```bash
cp .env.example .env
```

2) Levantar ambiente de desenvolvimento (backend + frontend):

```bash
docker-compose up --build
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```

3) Executar migrações e criar superuser dentro do container (após `up`):

```bash
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
```

4) Logs e debugging:

```bash
docker-compose logs -f web
docker-compose logs -f frontend
```

5) Rodar apenas backend em container (útil para CI/local):

```bash
docker build -t doaperto-backend .
docker run -p 8000:8000 --env-file .env doaperto-backend
```

6) Produção - sugestões rápidas:
- Substitua SQLite por Postgres; adicione serviço `db` no `docker-compose.yml` e ajuste `DATABASES` em `settings.py`.
- Sirva o backend com `gunicorn` e coloque `nginx` na frente para servir `static` e terminar TLS.
- Não use `DEBUG=True` em produção; carregue segredos via gerenciador de segredos.

7) CI (GitHub Actions):
- O workflow `.github/workflows/ci.yml` já faz `pip install .`, `migrate` e build do frontend.
- Ajuste steps para executar sua suíte de testes e linters (e.g. `pytest`, `eslint`).

Checklist de Infra/DevOps (opcional):
- [ ] Substituir SQLite por Postgres no compose
- [ ] Adicionar job de testes automatizados no CI
- [ ] Adicionar build e push de imagens para registry (Docker Hub / GitHub Packages)
- [ ] Adicionar healthchecks e restart policies nos serviços docker



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
- `GET/POST /api/eventos-doacao/` - Campanhas e eventos de arrecadação
- `GET /api/eventos-doacao/meus_eventos/` - Eventos criados pelo usuário autenticado
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
- **EventoDoacao** - Campanha temporária organizada por uma academia, ONG, mercado,
  associação ou outra entidade
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
- [x] Eventos de doação com período, entidade, endereço e categorias aceitas

### Fase 3 (MVP Features)
- [x] Geolocalização completa do usuário (disponível somente para instituições ou entidades)
- [x] Listagem com filtros avançados
- [x] Chat em tempo real (WebSockets)
- [x] Sistema de matching doador-receptor
- [x] Upload de imagens das doações (disponível para todos)

### Fase 4 (UX Completa)
- [x] Jornada de 5 etapas da persona
- [x] Layout responsivo com contraste acessível e estados vazios orientativos
- [x] Busca por palavra-chave, categoria e disponibilidade
- [x] Tela de pontos de coleta com localização por proximidade
- [x] Eventos de doação para academias, ONGs, supermercados e associações
- [x] Cadastro e login de entidades receptoras com endereço e localização pública
- [x] Lista pública de entidades próximas e itens destinados a cada entidade
- [ ] Sistema de referral/indicação
- [ ] Notificações
- [ ] Histórico de transações
- [ ] Ratings/Avaliações

## LGPD Compliance
- ✅ Consentimento explícito de dados
- ✅ Mascaramento de CPF/CNPJ
- ✅ Campo para deleção de dados
- ⏳ Implementar soft delete e anonimização

## Entidades receptoras

Entidades podem criar uma conta selecionando **Sou uma entidade** no cadastro.
Os tipos disponíveis incluem ONG, igreja, escola, ponto de reciclagem, academia,
supermercado e associação. Após o cadastro, a entidade pode complementar seu
perfil com endereço e localização; esses dados aparecem na tela **Onde doar e
receber**, junto dos itens disponíveis destinados a ela.

Endpoints públicos relacionados:

- `GET /api/receptores/entidades/`
- `GET /api/receptores/entidades/?lat=-23.55&lon=-46.63&km=20`
- `GET /api/receptores/{id}/itens-disponiveis/`

## Como Testar

### Criar um evento de doação

1. Faça login e acesse **Eventos** na barra de navegação.
2. Selecione **Criar evento**.
3. Informe a entidade organizadora, período de arrecadação, endereço, horário e
   categorias aceitas.
4. Publique o evento. Ele ficará disponível na listagem pública para a comunidade.

Exemplo de criação via API:

```bash
curl -X POST http://localhost:8000/api/eventos-doacao/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entidade_nome": "Academia Impacto",
    "entidade_tipo": "academia",
    "titulo": "Campanha do agasalho",
    "descricao": "Recebimento de roupas e cobertores em bom estado.",
    "endereco": "Rua das Flores, 100 - Centro",
    "data_inicio": "2026-06-01T08:00:00-03:00",
    "data_fim": "2026-06-15T18:00:00-03:00",
    "horario": "Segunda a sábado, das 8h às 18h",
    "status": "aberto",
    "categorias_ids": []
  }'
```

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


## Resultado:



https://github.com/user-attachments/assets/a9974cc6-a92f-467b-bdc3-56f2a4799f6f


