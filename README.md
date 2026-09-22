# Sistema Integrado de Gestão, PDV e Atendimento IA

Plataforma full-stack para **gestão de produtos, estoque, vendas, serviços e atendimento ao cliente**, desenvolvida com React, TypeScript e Python.

O sistema combina uma aplicação web de gestão com um serviço de atendimento automatizado via WhatsApp, permitindo que um agente de IA consulte informações do sistema e responda aos clientes utilizando dados atualizados da operação.

> **Status:** Em desenvolvimento

---

## ✨ Visão geral

O projeto foi desenvolvido para centralizar diferentes operações de um pequeno negócio em uma única plataforma.

A aplicação contempla atualmente:

* Gestão de produtos e catálogo;
* Controle de estoque;
* Ponto de Venda (PDV);
* Gestão de clientes;
* Ordens de serviço;
* Atendimento automatizado via WhatsApp;
* Consulta de dados do sistema por um agente de IA;
* Busca automatizada de imagens para produtos.

A arquitetura é organizada em serviços independentes e utiliza Docker para facilitar a execução do ecossistema.

---

## 🏗️ Arquitetura

```text
                         ┌─────────────────────┐
                         │      Cliente         │
                         │      WhatsApp        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Evolution API     │
                         │      WhatsApp       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   WhatsApp API      │
                         │      Flask          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │        n8n           │
                         │   Workflow / Agent  │
                         └──────────┬──────────┘
                                    │
                              AI Agent
                                    │
                         ┌──────────▼──────────┐
                         │    OpenAI / LLM     │
                         └──────────┬──────────┘
                                    │
                              HTTP Tools
                                    │
                                    ▼
┌──────────────────┐       ┌─────────────────────┐
│   React + Vite   │──────▶│   Python API        │
│   TypeScript     │       │   Flask             │
└──────────────────┘       └──────────┬──────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │   Database    │
                              └───────────────┘
```

O sistema é dividido principalmente em três partes:

1. **Aplicação web**, responsável pela gestão interna;
2. **API principal**, responsável pelas regras de negócio e persistência;
3. **Serviço de atendimento**, responsável pela integração entre WhatsApp, n8n e o agente de IA.

---

# 🖥️ Aplicação Web

O frontend foi desenvolvido com **React, TypeScript e Vite**.

A aplicação concentra as operações administrativas e de venda do sistema.

### Ponto de Venda

O módulo de PDV permite organizar produtos selecionados pelo operador e gerar o resumo da venda.

Principais componentes:

```text
CartTable
OrderSummary
ProductCard
```

### Catálogo e estoque

O sistema possui telas para:

* Cadastro de produtos;
* Cadastro de serviços;
* Consulta de produtos;
* Controle de estoque;
* Gerenciamento do catálogo;
* Busca e associação de imagens.

Entre os componentes relacionados:

```text
FormCadastroProduto
FormCadastroServico
ModalGerenciarCatalogo
ImageSearchModal
ControleEstoque
```

### Ordens de serviço

O sistema também possui estruturas para gerenciamento de ordens de serviço e seus respectivos estados.

---

# ⚙️ API Principal

A API foi desenvolvida em **Python** e organizada em camadas para separar responsabilidades.

Uma visão simplificada da estrutura é:

```text
backend/
├── controllers/
├── services/
├── repositories/
├── entities/
├── models/
├── schemas/
├── docs/
└── migrations/
```

### Controllers

Responsáveis pela exposição dos endpoints HTTP e pelo tratamento das requisições.

### Services

Concentram regras de negócio e orquestram operações que envolvem diferentes componentes do sistema.

### Repositories

Abstraem o acesso aos dados e evitam que as regras de negócio dependam diretamente da implementação de persistência.

### Entities, Models e DTOs

Separação entre representação dos dados persistidos, entidades utilizadas pela aplicação e objetos utilizados na comunicação através da API.

### Documentação

Os endpoints possuem documentação baseada em **OpenAPI/Swagger**, organizada na pasta `docs/`.

### Migrações

O banco de dados é versionado utilizando **Alembic**, permitindo acompanhar alterações estruturais através das migrations.

---

# 🤖 Atendimento via WhatsApp

O atendimento automatizado utiliza uma arquitetura baseada em integração entre serviços.

```text
WhatsApp
   │
   ▼
Evolution API
   │
   ▼
WhatsApp API (Flask)
   │
   ▼
n8n
   │
   ▼
AI Agent
   │
   ├── OpenAI
   ├── Memory
   └── HTTP Tools
          │
          ▼
      Python API
          │
          ▼
       Database
```

### Fluxo

1. O cliente envia uma mensagem pelo WhatsApp.
2. A **Evolution API** recebe a mensagem.
3. O serviço `whatsapp_api` recebe e processa o payload.
4. A mensagem é encaminhada para um workflow do **n8n**.
5. O workflow direciona a entrada para um **AI Agent**.
6. O agente utiliza um modelo da OpenAI para interpretar a solicitação.
7. Quando necessário, o agente utiliza ferramentas HTTP para consultar a API principal.
8. A API retorna informações atualizadas do sistema.
9. O agente utiliza essas informações para construir a resposta ao cliente.

### Ferramentas do agente

O agente pode consultar diferentes domínios da aplicação através da API, incluindo:

```text
search_shop_api
search_servico_api
search_order_service_api
```

Isso permite que as respostas sejam baseadas nos dados atuais do sistema em vez de depender exclusivamente do conhecimento do modelo.

---

# 🔎 Busca de imagens

O backend possui uma camada de integração dedicada à busca de imagens de produtos.

Os adaptadores:

```text
google_search_adapter
linkup_search_adapter
```

são utilizados pela camada de infraestrutura e acessados através de um serviço específico:

```text
image_search_service
```

A separação por adaptadores permite que diferentes provedores sejam utilizados sem acoplar as regras de negócio diretamente às APIs externas.

---

# 🐳 Infraestrutura

Os serviços são executados utilizando **Docker e Docker Compose**.

A composição do ambiente permite inicializar os principais componentes do sistema de forma conjunta:

```text
Frontend
   │
Backend API
   │
WhatsApp API
   │
Database
```

O serviço de WhatsApp possui seu próprio ambiente e dependências, mantendo sua execução separada da API principal.

---

# 🛠️ Stack tecnológica

### Frontend

* React
* TypeScript
* Vite

### Backend

* Python
* Flask
* SQLAlchemy
* Alembic
* OpenAPI / Swagger

### IA e automação

* OpenAI
* n8n
* AI Agents
* Evolution API
* HTTP Tools

### Infraestrutura

* Docker
* Docker Compose
* ngrok

### Banco de dados

* PostgreSQL
* SQLite durante o desenvolvimento

---

# 🚀 Executando localmente

## Pré-requisitos

* Docker
* Docker Compose
* Python
* Node.js
* Credenciais dos serviços externos utilizados pelo projeto

## 1. Configuração

Clone o repositório:

```bash
git clone <repository-url>
cd <repository>
```

Configure as variáveis de ambiente necessárias, incluindo as credenciais utilizadas pelos serviços de IA e busca de imagens.

Por exemplo:

```text
backend/python/.env
```

> Nunca versione arquivos `.env` ou credenciais reais no repositório.

## 2. Inicialização

Na raiz do projeto:

```bash
docker compose up --build
```

Isso inicializa os serviços definidos no `docker-compose.yaml`.

## 3. Configuração do WhatsApp

Após iniciar os serviços, o processo de configuração do WhatsApp pode ser executado através do script:

```bash
python whatsapp_setup.py
```

O script auxilia no processo de configuração da instância utilizada pela Evolution API.

---

# 📂 Principais módulos

```text
ERP / Gestão
├── Produtos
├── Serviços
├── Clientes
├── Estoque
├── Catálogo
└── Ordens de Serviço

PDV
├── Carrinho
├── Produtos
└── Resumo da Venda

Atendimento
├── WhatsApp
├── n8n
├── AI Agent
└── API Tools

Infraestrutura
├── Docker
├── Docker Compose
└── ngrok
```

---

# 🎯 Objetivos técnicos

O projeto foi desenvolvido também como laboratório prático para explorar:

* Arquitetura em camadas;
* Separação de responsabilidades;
* APIs REST;
* Repository Pattern;
* DTOs e validação;
* Migrações de banco de dados;
* Integração entre serviços;
* Docker e Docker Compose;
* Desenvolvimento frontend com React e TypeScript;
* Integração de LLMs com aplicações reais;
* Agentes de IA utilizando ferramentas externas;
* Comunicação entre sistemas através de APIs HTTP.

---

# 📌 Status

**Em desenvolvimento.**

Novos módulos e integrações podem ser adicionados conforme a evolução do sistema.
