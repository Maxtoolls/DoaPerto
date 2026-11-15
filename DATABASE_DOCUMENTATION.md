# 📊 DoaPerto - Documentação do Banco de Dados

> Atualizada conforme os modelos e migrações atuais do projeto. A última migração
> documentada é `doacoes.0007_eventodoacao`.

## Visão Geral

O DoaPerto utiliza um banco de dados relacional (SQLite em desenvolvimento, compatível com PostgreSQL/MySQL em produção) com foco em:
- ✅ LGPD Compliance (consentimento, deleção de dados)
- ✅ Geolocalização (latitude/longitude)
- ✅ Relacionamentos entre Doadores e Receptores
- ✅ Histórico de Transações e Chat

---

## 🏗️ Estrutura das Tabelas

### 1. **auth_user** (Django User)
- Gerenciada pelo Django
- Campos: username, email, password, first_name, last_name
- Relacionada com `doacoes_usuario` via OneToOneField

### 2. **doacoes_usuario**
Usuário base do DoaPerto (extensão do Django User)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK |
| user_id | INT | FK para auth_user |
| tipo | VARCHAR(20) | 'doador' ou 'receptor' |
| telefone | VARCHAR(20) | Contato do usuário |
| endereco | VARCHAR(255) | Endereço completo |
| latitude | DECIMAL(9,6) | Coordenada GPS |
| longitude | DECIMAL(9,6) | Coordenada GPS |
| aceite_termos | BOOLEAN | LGPD: consentimento |
| data_consentimento | DATETIME | LGPD: quando consentiu |
| deseja_delecao | BOOLEAN | LGPD: solicitação de deleção |
| referido_por_id | INT | FK para outro usuário (referral) |

**Índices:** tipo, aceite_termos, referido_por

---

### 3. **doacoes_doador**
Perfil de Doador

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK |
| usuario_id | INT | FK para doacoes_usuario (unique) |
| cpf | VARCHAR(14) | CPF; exposto somente para escrita pela API |
| faixa_idade | VARCHAR(20) | '18-25', '25-35', etc |
| faixa_renda | VARCHAR(20) | 'até 1000', '1000-3000', etc |
| biografia | TEXT | Sobre o doador |
| foto_perfil | VARCHAR(255) | URL da foto |
| ativo | BOOLEAN | Se está ativo no app |

**Índices:** ativo, faixa_idade, faixa_renda

**Relacionamento:** `doacoes_doador_categorias_doacao` (ManyToMany)

---

### 4. **doacoes_receptor**
Perfil de Receptor

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK |
| usuario_id | INT | FK para doacoes_usuario (unique) |
| tipo | VARCHAR(50) | 'pessoa', 'ong', 'igreja', 'escola', 'reciclagem', 'academia', 'supermercado' ou 'associacao' |
| cnpj | VARCHAR(18) | CNPJ se for jurídica |
| responsavel | VARCHAR(150) | Nome do responsável |
| telefone_contato | VARCHAR(20) | Contato principal |
| publico_atendido | TEXT | Descrição do público |
| disponibilidade_retirada | BOOLEAN | Se pode retirar itens |
| horarios_disponibilidade | VARCHAR(255) | Horário de funcionamento |
| sobre | TEXT | Informações sobre o receptor |
| ativo | BOOLEAN | Se está ativo |

**Índices:** tipo, ativo

**Relacionamento:** `doacoes_receptor_tipos_item_aceitos` (ManyToMany)

Contas institucionais são criadas pelo endpoint de registro com
`tipo='entidade'` e um `entidade_tipo`. O endereço e as coordenadas públicas
ficam em `doacoes_usuario`; itens publicados por doadores aparecem para a
entidade quando `doacoes_itemdoacao.receptor_confirmado_id` aponta para seu
registro.

Endpoints públicos:

- `GET /api/receptores/entidades/` lista entidades ativas com endereço e itens disponíveis.
- `GET /api/receptores/entidades/?lat=<lat>&lon=<lon>&km=<raio>` filtra por proximidade.
- `GET /api/receptores/<id>/itens-disponiveis/` lista itens destinados à entidade.

---

### 5. **doacoes_categoriaitem**
Categorias de Itens para Doação

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK |
| nome | VARCHAR(100) | Nome da categoria (unique) |
| descricao | TEXT | Descrição |
| icone | VARCHAR(50) | Emoji ou ícone |

**Exemplo:** 🍎 Alimento, 📚 Educação, 👕 Vestuário

---

### 6. **doacoes_pontocoleta**
Pontos de Coleta e Distribuição

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK |
| nome | VARCHAR(200) | Nome do ponto |
| tipo | VARCHAR(50) | 'ong', 'igreja', 'escola', 'reciclagem', 'outro' |
| endereco | VARCHAR(255) | Endereço completo |
| latitude | DECIMAL(9,6) | Coordenada GPS |
| longitude | DECIMAL(9,6) | Coordenada GPS |
| telefone | VARCHAR(20) | Contato |
| email | VARCHAR(255) | Email do ponto |
| horarios | TEXT | Horário de funcionamento |
| capacidade_armazenamento | VARCHAR(100) | Capacidade do local |
| responsavel_id | INT | FK para doacoes_usuario |
| ativo | BOOLEAN | Se está ativo |

**Índices:** tipo, latitude+longitude, ativo

---

### 7. **doacoes_eventodoacao**
Eventos temporários de arrecadação organizados por entidades da comunidade.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK |
| organizador_id | INT | FK para doacoes_usuario |
| entidade_nome | VARCHAR(200) | Academia, ONG, mercado ou outra entidade |
| entidade_tipo | VARCHAR(30) | academia, ong, supermercado, associacao, igreja ou outro |
| titulo | VARCHAR(200) | Nome da campanha |
| descricao | TEXT | O que será arrecadado e orientações |
| endereco | VARCHAR(255) | Local de recebimento |
| latitude | DECIMAL(9,6) | Coordenada opcional do evento |
| longitude | DECIMAL(9,6) | Coordenada opcional do evento |
| data_inicio | DATETIME | Início da arrecadação |
| data_fim | DATETIME | Encerramento da arrecadação |
| horario | VARCHAR(100) | Horário de atendimento |
| capacidade | VARCHAR(100) | Capacidade ou observações logísticas |
| status | VARCHAR(20) | planejado, aberto ou encerrado |
| data_criacao | DATETIME | Data de publicação |

**Relacionamento:** `categorias` é ManyToMany com `doacoes_categoriaitem`.

---

### 8. **doacoes_itemdoacao**
Itens Específicos para Doação

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK |
| doador_id | INT | FK para doacoes_doador |
| categoria_id | INT | FK para doacoes_categoriaitem |
| titulo | VARCHAR(150) | Título do item |
| descricao | TEXT | Descrição detalhada |
| quantidade | INT | Quantidade disponível |
| unidade | VARCHAR(50) | 'unidade', 'kg', 'litro', etc |
| estado_conservacao | VARCHAR(20) | 'novo', 'seminovo' ou 'usado' |
| valor_contribuicao | DECIMAL(10,2) | Contribuição voluntária; nulo representa gratuita |
| data_disponibilidade | DATE | Data disponível para retirada |
| tipo_entrega | VARCHAR(20) | retirada, entrega_gratis ou taxa_combinada |
| status | VARCHAR(20) | 'disponivel', 'interessado', 'doado', 'cancelado' |
| receptor_confirmado_id | INT | FK para doacoes_receptor (quem vai receber) |
| ponto_coleta_id | INT | FK para doacoes_pontocoleta (local de coleta) |
| pode_retirar_diretamente | BOOLEAN | Se doador pode entregar direto |
| imagem | VARCHAR(255) | URL da imagem |
| data_expiracao | DATETIME | Quando expira a doação |

**Índices:** doador, categoria, status, data_criacao

---

### 9. **doacoes_interesse**
Interesse de Receptor em Item

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK |
| item_id | INT | FK para doacoes_itemdoacao |
| receptor_id | INT | FK para doacoes_receptor |
| status | VARCHAR(20) | 'interesse', 'confirmado', 'cancelado', 'finalizado' |
| mensagem_inicial | TEXT | Mensagem do receptor |
| data_criacao | DATETIME | Quando expressou interesse |
| data_atualizacao | DATETIME | Última atualização |

**Unique:** (item_id, receptor_id) - um interesse por receptor/item

---

### 10. **doacoes_mensagem**
Chat entre Doador e Receptor

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK |
| remetente_id | INT | FK para doacoes_usuario (quem enviou) |
| destinatario_id | INT | FK para doacoes_usuario (quem recebe) |
| interesse_id | INT | FK para doacoes_interesse (contexto) |
| conteudo | TEXT | Conteúdo da mensagem |
| lida | BOOLEAN | Se foi lida |
| data_criacao | DATETIME | Quando foi enviada |

**Índices:** remetente+data, destinatario+lida

---

### 11. **doacoes_doacao**
API Simples (compatibilidade com versão anterior)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | PK |
| item | VARCHAR(100) | Nome do item |
| descricao | TEXT | Descrição |
| categoria | VARCHAR(50) | Categoria |
| quantidade | INT | Quantidade |
| data_criacao | DATETIME | Data de criação |

---

## 🔗 Relacionamentos

```
auth_user (1) -------- (1) doacoes_usuario
                            |
                            +-- (1) doacoes_doador --- (M) doacoes_categoriaitem
                            |
                            +-- (1) doacoes_receptor - (M) doacoes_categoriaitem

doacoes_doador (1) -------- (M) doacoes_itemdoacao
doacoes_receptor (1) -------- (M) doacoes_interesse
doacoes_itemdoacao (1) -------- (M) doacoes_interesse

doacoes_usuario (1) -------- (M) doacoes_eventodoacao
doacoes_eventodoacao (M) -------- (M) doacoes_categoriaitem

doacoes_usuario (1) -------- (M) doacoes_mensagem (remetente)
doacoes_usuario (1) -------- (M) doacoes_mensagem (destinatario)

doacoes_usuario (1) -------- (M) doacoes_usuario (referido_por - self-reference)
```

---

## 🔌 Endpoints relacionados

| Método | Endpoint | Acesso | Uso |
|--------|----------|--------|-----|
| GET | `/api/eventos-doacao/` | Público | Listar campanhas |
| POST | `/api/eventos-doacao/` | Autenticado | Criar campanha |
| GET | `/api/eventos-doacao/meus_eventos/` | Autenticado | Listar campanhas do usuário |
| GET/POST | `/api/pontos-coleta/` | Leitura pública / escrita autenticada | Gerenciar pontos |
| GET | `/api/itens-doacao/?search=...` | Leitura pública | Buscar itens |

Eventos são sempre associados ao usuário autenticado no backend; o cliente não pode
informar outro `organizador_id` na criação.

---

## 📍 Geolocalização

### Armazenamento
- **Latitude:** DECIMAL(9,6) - até 9 dígitos, 6 casas decimais (~0.11 m de precisão)
- **Longitude:** DECIMAL(9,6) - idem

### Busca por Proximidade (Fórmula de Haversine)
```sql
SELECT *,
  (3959 * ACOS(COS(RADIANS(latitude)) * COS(RADIANS(latitude_user)) *
  COS(RADIANS(longitude_user) - RADIANS(longitude)) + SIN(RADIANS(latitude)) *
  SIN(RADIANS(latitude_user)))) as distancia_km
FROM doacoes_usuario
WHERE tipo = 'doador'
HAVING distancia_km <= 10
ORDER BY distancia_km;
```

### Índices Compostos
```sql
CREATE INDEX idx_geo ON doacoes_usuario(latitude, longitude);
CREATE INDEX idx_geo_ponto ON doacoes_pontocoleta(latitude, longitude);
```

---

## 🔐 LGPD Compliance

### Campos de Conformidade
1. **aceite_termos** - Consentimento explícito do usuário
2. **data_consentimento** - Data/hora do consentimento
3. **deseja_delecao** - Flag para deleção de dados

### Operações LGPD

**Solicitar Deleção:**
```sql
UPDATE doacoes_usuario SET deseja_delecao = TRUE WHERE id = ?;
```

**Anonimizar Dados:**
```sql
UPDATE doacoes_usuario SET
  endereco = NULL,
  latitude = NULL,
  longitude = NULL,
  telefone = NULL
WHERE id = ? AND deseja_delecao = TRUE;
```

**Usuários com Consentimento:**
```sql
SELECT COUNT(*) FROM doacoes_usuario
WHERE aceite_termos = TRUE AND data_consentimento IS NOT NULL;
```

---

## 📊 Views Úteis

### Estatísticas Gerais
```sql
CREATE VIEW vw_estatisticas AS
SELECT
  (SELECT COUNT(*) FROM doacoes_usuario) as total_usuarios,
  (SELECT COUNT(*) FROM doacoes_doador WHERE ativo = TRUE) as doadores_ativos,
  (SELECT COUNT(*) FROM doacoes_receptor WHERE ativo = TRUE) as receptores_ativos,
  (SELECT COUNT(*) FROM doacoes_itemdoacao WHERE status = 'disponivel') as itens_disponiveis,
  (SELECT COUNT(*) FROM doacoes_pontocoleta WHERE ativo = TRUE) as pontos_ativos,
  (SELECT COUNT(*) FROM doacoes_itemdoacao WHERE status = 'doado') as total_doacoes;
```

### Itens Disponíveis com Info do Doador
```sql
CREATE VIEW vw_itens_disponiveis AS
SELECT
  id.id, id.titulo, id.descricao, id.quantidade,
  c.nome as categoria,
  u.endereco, u.latitude, u.longitude
FROM doacoes_itemdoacao id
JOIN doacoes_doador d ON id.doador_id = d.id
JOIN doacoes_usuario u ON d.usuario_id = u.id
JOIN doacoes_categoriaitem c ON id.categoria_id = c.id
WHERE id.status = 'disponivel' AND d.ativo = TRUE;
```

---

## 🔧 Manutenção

### Limpeza de Dados Antigos
```sql
-- Remover interesses expirados (> 30 dias)
DELETE FROM doacoes_interesse
WHERE status = 'cancelado'
AND data_criacao < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Marcar itens como expirados
UPDATE doacoes_itemdoacao
SET status = 'cancelado'
WHERE status = 'disponivel'
AND data_expiracao < NOW();
```

### Verificação de Integridade
```sql
-- Orfãos: doadores sem usuário
SELECT d.* FROM doacoes_doador d
WHERE d.usuario_id NOT IN (SELECT id FROM doacoes_usuario);

-- Itens sem receptor válido
SELECT i.* FROM doacoes_itemdoacao i
WHERE i.receptor_confirmado_id IS NOT NULL
AND i.receptor_confirmado_id NOT IN (SELECT id FROM doacoes_receptor);
```

---

## 📈 Performance

### Índices Críticos
1. `idx_usuario_tipo` - Filtros por tipo de usuário
2. `idx_itemdoacao_status` - Listagem de itens disponíveis
3. `idx_pontocoleta_latitude_longitude` - Geolocalização
4. `idx_mensagem_destinatario_lida` - Notificações não lidas

### Otimizações Recomendadas
- Usar `EXPLAIN` antes de queries complexas
- Adicionar índices em colunas de junção frequentes
- Particionar tabelas grandes (>1M registros)
- Cache Redis para consultas de geolocalização

---

## 🚀 Integração com Django ORM

O banco de dados foi criado via **Django Migrations** automaticamente:

```bash
python manage.py makemigrations
python manage.py migrate
```

Os modelos estão em `doacoes/models.py` e mapeiam perfeitamente para essa estrutura.

---

## 📝 Próximas Fases

### Fase 3
- [x] Implementar busca por geolocalização real para itens e pontos
- [x] Filtros avançados de itens e campanhas de arrecadação
- [ ] Melhorar índices para performance
- [ ] Adicionar triggers para auditoria

### Fase 4
- [ ] Replicação de banco de dados
- [ ] Backup automático
- [ ] Monitoramento de performance

---

**Criado em:** 2026-05-10
**Atualizado em:** 2026-11-14
**Versão:** 1.1
**Compatibilidade:** SQLite, PostgreSQL, MySQL
