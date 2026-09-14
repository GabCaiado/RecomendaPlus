# Executando a Aplicação com Docker Compose

Este documento fornece as instruções para subir toda a aplicação (**Backend Flask** + **Frontend Next.js**) utilizando o Docker Compose.

---

## Pré-requisitos

- **Docker** instalado ([Download Docker Desktop](https://www.docker.com/products/docker-desktop/))
- **Docker Compose** (incluso no Docker Desktop)

---

## Como Rodar a Aplicação

### 1. Iniciar os Containers

No diretório raiz do projeto, execute:

```bash
docker compose up --build
```

Isso fará o build dos containers do backend e do frontend e iniciará os serviços nas seguintes portas:

- **Frontend Next.js**: [http://localhost:3002](http://localhost:3002)
- **Backend Flask**: [http://localhost:5000](http://localhost:5000)

### 2. Rodar em segundo plano (Modo Detached)

```bash
docker compose up -d --build
```

Para visualizar os logs:
```bash
docker compose logs -f
```

---

## Popular o Banco de Dados (Seed Data)

Para popular o banco SQLite inicial com filmes, séries e usuários de teste (`lucas12` e `gabriella22`), rode o comando abaixo enquanto o container backend estiver ativo:

```bash
docker compose exec backend python seed.py
```

### Usuários de teste pré-configurados:
- **`lucas12`** | Senha: `123456` | Idade: 12 (Filtra conteúdos +14, +16 e +18)
- **`gabriella22`** | Senha: `123456` | Idade: 22 (Acesso completo ao catálogo)

---

## Parar os Containers

Para encerrar a execução dos serviços:

```bash
docker compose down
```

Para encerrar e remover volumes persistentes:

```bash
docker compose down -v
```
