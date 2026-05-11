-- ============================================================
-- DoaPerto - Database Template
-- Sistema de Doações P2P com Geolocalização
-- ============================================================

-- TABELA: Categorias de Itens
CREATE TABLE IF NOT EXISTS doacoes_categoriaitem (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    icone VARCHAR(50),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: Usuários (extensão do Django User)
CREATE TABLE IF NOT EXISTS doacoes_usuario (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL DEFAULT 'doador',
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    aceite_termos BOOLEAN DEFAULT FALSE,
    data_consentimento DATETIME,
    deseja_delecao BOOLEAN DEFAULT FALSE,
    referido_por_id INTEGER,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth_user(id),
    FOREIGN KEY (referido_por_id) REFERENCES doacoes_usuario(id)
);

-- TABELA: Doadores
CREATE TABLE IF NOT EXISTS doacoes_doador (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    usuario_id INTEGER NOT NULL UNIQUE,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    faixa_idade VARCHAR(20),
    faixa_renda VARCHAR(20),
    biografia TEXT,
    foto_perfil VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES doacoes_usuario(id)
);

-- TABELA: Relação Doador-Categorias
CREATE TABLE IF NOT EXISTS doacoes_doador_categorias_doacao (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    doador_id INTEGER NOT NULL,
    categoriaitem_id INTEGER NOT NULL,
    FOREIGN KEY (doador_id) REFERENCES doacoes_doador(id),
    FOREIGN KEY (categoriaitem_id) REFERENCES doacoes_categoriaitem(id),
    UNIQUE(doador_id, categoriaitem_id)
);

-- TABELA: Receptores
CREATE TABLE IF NOT EXISTS doacoes_receptor (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    usuario_id INTEGER NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    responsavel VARCHAR(150),
    telefone_contato VARCHAR(20),
    publico_atendido TEXT,
    disponibilidade_retirada BOOLEAN DEFAULT FALSE,
    horarios_disponibilidade VARCHAR(255),
    sobre TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES doacoes_usuario(id)
);

-- TABELA: Relação Receptor-Categorias
CREATE TABLE IF NOT EXISTS doacoes_receptor_tipos_item_aceitos (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    receptor_id INTEGER NOT NULL,
    categoriaitem_id INTEGER NOT NULL,
    FOREIGN KEY (receptor_id) REFERENCES doacoes_receptor(id),
    FOREIGN KEY (categoriaitem_id) REFERENCES doacoes_categoriaitem(id),
    UNIQUE(receptor_id, categoriaitem_id)
);

-- TABELA: Pontos de Coleta
CREATE TABLE IF NOT EXISTS doacoes_pontocoleta (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(255),
    horarios TEXT,
    capacidade_armazenamento VARCHAR(100),
    responsavel_id INTEGER,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (responsavel_id) REFERENCES doacoes_usuario(id)
);

-- TABELA: Relação PontoColeta-Categorias
CREATE TABLE IF NOT EXISTS doacoes_pontocoleta_tipos_item_aceitos (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    pontocoleta_id INTEGER NOT NULL,
    categoriaitem_id INTEGER NOT NULL,
    FOREIGN KEY (pontocoleta_id) REFERENCES doacoes_pontocoleta(id),
    FOREIGN KEY (categoriaitem_id) REFERENCES doacoes_categoriaitem(id),
    UNIQUE(pontocoleta_id, categoriaitem_id)
);

-- TABELA: Itens de Doação
CREATE TABLE IF NOT EXISTS doacoes_itemdoacao (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    doador_id INTEGER NOT NULL,
    categoria_id INTEGER,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    unidade VARCHAR(50) DEFAULT 'unidade',
    status VARCHAR(20) DEFAULT 'disponivel',
    receptor_confirmado_id INTEGER,
    ponto_coleta_id INTEGER,
    pode_retirar_diretamente BOOLEAN DEFAULT TRUE,
    imagem VARCHAR(255),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME,
    FOREIGN KEY (doador_id) REFERENCES doacoes_doador(id),
    FOREIGN KEY (categoria_id) REFERENCES doacoes_categoriaitem(id),
    FOREIGN KEY (receptor_confirmado_id) REFERENCES doacoes_receptor(id),
    FOREIGN KEY (ponto_coleta_id) REFERENCES doacoes_pontocoleta(id)
);

-- TABELA: Interesses
CREATE TABLE IF NOT EXISTS doacoes_interesse (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    item_id INTEGER NOT NULL,
    receptor_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'interesse',
    mensagem_inicial TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES doacoes_itemdoacao(id),
    FOREIGN KEY (receptor_id) REFERENCES doacoes_receptor(id),
    UNIQUE(item_id, receptor_id)
);

-- TABELA: Mensagens (Chat)
CREATE TABLE IF NOT EXISTS doacoes_mensagem (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    remetente_id INTEGER NOT NULL,
    destinatario_id INTEGER NOT NULL,
    interesse_id INTEGER,
    conteudo TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (remetente_id) REFERENCES doacoes_usuario(id),
    FOREIGN KEY (destinatario_id) REFERENCES doacoes_usuario(id),
    FOREIGN KEY (interesse_id) REFERENCES doacoes_interesse(id)
);

-- TABELA: Doações (API simples)
CREATE TABLE IF NOT EXISTS doacoes_doacao (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    item VARCHAR(100) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    quantidade INTEGER,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ÍNDICES para Performance
-- ============================================================

-- Índices em Usuario
CREATE INDEX idx_usuario_tipo ON doacoes_usuario(tipo);
CREATE INDEX idx_usuario_aceite_termos ON doacoes_usuario(aceite_termos);
CREATE INDEX idx_usuario_referido_por ON doacoes_usuario(referido_por_id);

-- Índices em Doador
CREATE INDEX idx_doador_ativo ON doacoes_doador(ativo);
CREATE INDEX idx_doador_faixa_idade ON doacoes_doador(faixa_idade);
CREATE INDEX idx_doador_faixa_renda ON doacoes_doador(faixa_renda);

-- Índices em Receptor
CREATE INDEX idx_receptor_tipo ON doacoes_receptor(tipo);
CREATE INDEX idx_receptor_ativo ON doacoes_receptor(ativo);

-- Índices em PontoColeta
CREATE INDEX idx_pontocoleta_tipo ON doacoes_pontocoleta(tipo);
CREATE INDEX idx_pontocoleta_latitude_longitude ON doacoes_pontocoleta(latitude, longitude);
CREATE INDEX idx_pontocoleta_ativo ON doacoes_pontocoleta(ativo);

-- Índices em ItemDoacao
CREATE INDEX idx_itemdoacao_doador ON doacoes_itemdoacao(doador_id);
CREATE INDEX idx_itemdoacao_categoria ON doacoes_itemdoacao(categoria_id);
CREATE INDEX idx_itemdoacao_status ON doacoes_itemdoacao(status);
CREATE INDEX idx_itemdoacao_data_criacao ON doacoes_itemdoacao(data_criacao);

-- Índices em Mensagem
CREATE INDEX idx_mensagem_remetente_data ON doacoes_mensagem(remetente_id, data_criacao);
CREATE INDEX idx_mensagem_destinatario_lida ON doacoes_mensagem(destinatario_id, lida);

-- Índices em Interesse
CREATE INDEX idx_interesse_item ON doacoes_interesse(item_id);
CREATE INDEX idx_interesse_receptor ON doacoes_interesse(receptor_id);
CREATE INDEX idx_interesse_status ON doacoes_interesse(status);

-- ============================================================
-- DADOS DE EXEMPLO
-- ============================================================

-- Categorias de Itens
INSERT INTO doacoes_categoriaitem (nome, descricao, icone) VALUES
('Alimento', 'Alimentos e bebidas', '🍎'),
('Vestuário', 'Roupas e acessórios', '👕'),
('Educação', 'Livros e materiais educativos', '📚'),
('Eletrônicos', 'Eletrônicos e tecnologia', '💻'),
('Móveis', 'Móveis e decoração', '🛋️'),
('Saúde', 'Produtos de saúde e higiene', '💊'),
('Brinquedos', 'Brinquedos e jogos', '🎮'),
('Reciclagem', 'Materiais para reciclagem', '♻️');

-- Doações Simples (API)
INSERT INTO doacoes_doacao (item, descricao, categoria, quantidade) VALUES
('Cesta Básica', 'Cesta com alimentos não perecíveis', 'Alimento', 2),
('Livros', 'Livros de ficção científica', 'Educação', 5),
('Roupas', 'Camisetas em bom estado', 'Vestuário', 10),
('Computador', 'Notebook funcional', 'Eletrônicos', 1),
('Sofá', 'Sofá cinza 3 lugares', 'Móveis', 1);

-- ============================================================
-- VIEWS ÚTEIS
-- ============================================================

-- View: Estatísticas Gerais
CREATE VIEW IF NOT EXISTS vw_estatisticas AS
SELECT
    (SELECT COUNT(*) FROM doacoes_usuario) as total_usuarios,
    (SELECT COUNT(*) FROM doacoes_doador WHERE ativo = TRUE) as doadores_ativos,
    (SELECT COUNT(*) FROM doacoes_receptor WHERE ativo = TRUE) as receptores_ativos,
    (SELECT COUNT(*) FROM doacoes_itemdoacao WHERE status = 'disponivel') as itens_disponiveis,
    (SELECT COUNT(*) FROM doacoes_pontocoleta WHERE ativo = TRUE) as pontos_ativos,
    (SELECT COUNT(*) FROM doacoes_itemdoacao WHERE status = 'doado') as total_doacoes;

-- View: Itens Disponíveis com Informações do Doador
CREATE VIEW IF NOT EXISTS vw_itens_disponiveis AS
SELECT
    id.id,
    id.titulo,
    id.descricao,
    id.quantidade,
    id.unidade,
    c.nome as categoria,
    d.usuario_id as doador_id,
    u.endereco,
    u.latitude,
    u.longitude,
    id.data_criacao
FROM doacoes_itemdoacao id
JOIN doacoes_doador d ON id.doador_id = d.id
JOIN doacoes_usuario u ON d.usuario_id = u.id
JOIN doacoes_categoriaitem c ON id.categoria_id = c.id
WHERE id.status = 'disponivel' AND d.ativo = TRUE;

-- View: Pontos de Coleta com Categorias
CREATE VIEW IF NOT EXISTS vw_pontos_coleta_categorias AS
SELECT
    pc.id,
    pc.nome,
    pc.tipo,
    pc.endereco,
    pc.latitude,
    pc.longitude,
    GROUP_CONCAT(c.nome SEPARATOR ', ') as categorias_aceitas
FROM doacoes_pontocoleta pc
LEFT JOIN doacoes_pontocoleta_tipos_item_aceitos ptc ON pc.id = ptc.pontocoleta_id
LEFT JOIN doacoes_categoriaitem c ON ptc.categoriaitem_id = c.id
WHERE pc.ativo = TRUE
GROUP BY pc.id;

-- ============================================================
-- QUERIES ÚTEIS
-- ============================================================

-- Encontrar doadores próximos a uma localização (em km)
-- SELECT *,
--   (3959 * ACOS(COS(RADIANS(latitude)) * COS(RADIANS(?)) *
--   COS(RADIANS(?) - RADIANS(longitude)) + SIN(RADIANS(latitude)) *
--   SIN(RADIANS(?)))) as distancia_km
-- FROM doacoes_usuario
-- WHERE tipo = 'doador' AND (3959 * ACOS(COS(RADIANS(latitude)) * COS(RADIANS(?)) *
-- COS(RADIANS(?) - RADIANS(longitude)) + SIN(RADIANS(latitude)) *
-- SIN(RADIANS(?)))) <= 10
-- ORDER BY distancia_km;

-- Itens por categoria
-- SELECT c.nome, COUNT(id.id) as total FROM doacoes_itemdoacao id
-- JOIN doacoes_categoriaitem c ON id.categoria_id = c.id
-- WHERE id.status = 'disponivel'
-- GROUP BY c.id ORDER BY total DESC;

-- Receptores com mais interesse em itens
-- SELECT r.id, u.endereco, COUNT(i.id) as total_interesses
-- FROM doacoes_receptor r
-- JOIN doacoes_usuario u ON r.usuario_id = u.id
-- LEFT JOIN doacoes_interesse i ON r.id = i.receptor_id
-- GROUP BY r.id ORDER BY total_interesses DESC;

-- ============================================================
-- LGPD - Queries para Conformidade
-- ============================================================

-- Usuários que solicitaram deleção
-- SELECT u.id, u.user_id, u.data_criacao FROM doacoes_usuario
-- WHERE deseja_delecao = TRUE;

-- Soft delete de dados de usuário (anonimização)
-- UPDATE doacoes_usuario SET endereco = NULL, latitude = NULL, longitude = NULL, telefone = NULL
-- WHERE id = ? AND deseja_delecao = TRUE;

-- Usuários que consentiriam dados
-- SELECT COUNT(*) as usuarios_com_consentimento FROM doacoes_usuario
-- WHERE aceite_termos = TRUE AND data_consentimento IS NOT NULL;

-- ============================================================
-- NOTAS DE INTEGRAÇÃO
-- ============================================================
--
-- 1. Este template usa SQLite/MySQL (compatível com Django)
-- 2. As migrações Django já criaram essas tabelas
-- 3. Os índices melhoram performance em buscas por geolocalização
-- 4. As views facilitam relatórios e dashboards
-- 5. LGPD compliant com campos de consentimento
--
-- ============================================================
