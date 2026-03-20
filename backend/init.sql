-- 1. Tabela de Clientes (Referente à aba "Dados do Cliente")
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    celular VARCHAR(20),
    sem_whatsapp BOOLEAN DEFAULT FALSE, -- Baseado no checkbox "Sem Whatsapp"
    bike_info TEXT,                     -- Baseado no campo "Bike: Quadro Cor Aro Detalhe"
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Pedidos / Vendas (Referente ao "Resumo do Pedido")
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL, -- Permite venda sem cadastro (cliente anônimo)
    
    -- Valores do Resumo
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    taxas_cartao DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    desconto DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    valor_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    valor_pago DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    
    -- Configurações de Pagamento e Faturamento
    metodo_pagamento VARCHAR(50),        -- Ex: 'PIX', 'DINHEIRO', 'CARTAO_CREDITO' (Dropdown "Método")
    emitir_nota_fiscal BOOLEAN DEFAULT FALSE, -- Toggle "Emitir Nota Fiscal"
    
    -- Status e Rastreio
    status_pedido VARCHAR(50) DEFAULT 'CONCLUIDO', -- Ex: 'PENDENTE', 'CONCLUIDO', 'CANCELADO'
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Itens do Pedido (Referente à tabela de carrinho no topo direito)
CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    
    quantidade INTEGER NOT NULL,
    valor_unitario DECIMAL(10, 2) NOT NULL, -- Gravado no momento da venda para não alterar se o preço base mudar no futuro
    valor_total DECIMAL(10, 2) NOT NULL,    -- quantidade * valor_unitario
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.1 Tabela de Categorias (Ex: Bicicletas, Peças, Acessórios)
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.2 Tabela de Sub-Categorias (Ex: Mountain Bike, Pneus, Capacetes)
CREATE TABLE subcategorias (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.3 Tabela de Marcas (Ex: Shimano, Oggi, Maxxis)
CREATE TABLE marcas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.4 Tabela de Relacionamento (Muitos para Muitos: Categoria <-> Marca)
-- Define que a Categoria "Pneus" pode ter as Marcas "Maxxis" e "Pirelli"
-- E a Marca "Shimano" pode pertencer às Categorias "Freios" e "Marchas"
CREATE TABLE categorias_marcas (
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
    marca_id INTEGER REFERENCES marcas(id) ON DELETE CASCADE,
    PRIMARY KEY (categoria_id, marca_id)
);

-- =========================================================================
-- TABELA DE PRODUTOS ATUALIZADA
-- =========================================================================

-- 2.5 Tabela de Produtos / Serviços
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    
    -- Chaves Estrangeiras do Catálogo
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE RESTRICT,
    subcategoria_id INTEGER REFERENCES subcategorias(id) ON DELETE SET NULL,
    marca_id INTEGER REFERENCES marcas(id) ON DELETE RESTRICT,
    
    -- Identificação e Textos
    descricao VARCHAR(255) NOT NULL,    -- O antigo "nome" do produto
    observacao TEXT,                    -- Detalhes adicionais ou local de guarda
    sku VARCHAR(100) UNIQUE,            -- Código interno/código de barras
    
    -- Valores Financeiros
    valor_venda DECIMAL(10, 2) NOT NULL,
    valor_instalacao DECIMAL(10, 2) DEFAULT 0.00, -- Opcional
    custo_compra DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    
    -- Controle de Estoque
    estoque_atual INTEGER NOT NULL DEFAULT 0,
    estoque_minimo INTEGER NOT NULL DEFAULT 0,
    
    -- Especificações Dinâmicas (Até 3)
    especificacao_1 VARCHAR(255),       -- Ex: "Aro 29" ou "Cor: Preto"
    especificacao_2 VARCHAR(255),       -- Ex: "Material: Carbono"
    especificacao_3 VARCHAR(255),       -- Ex: "Tamanho: M"
    
    -- Metadados Antigos que valem a pena manter
    imagem_url TEXT,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);