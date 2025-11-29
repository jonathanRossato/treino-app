# 🚀 Guia de Deploy - Treino App

Este guia explica como configurar o deploy automático do Treino App no Vercel usando GitHub Actions.

## 📋 Pré-requisitos

- Conta no [GitHub](https://github.com)
- Conta no [Vercel](https://vercel.com)
- Repositório Git do projeto

## 🔧 Configuração Inicial

### 1. Criar Projeto no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New Project"
3. Importe seu repositório do GitHub
4. Configure as seguintes opções:
   - **Framework Preset**: Other
   - **Build Command**: `pnpm build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `pnpm install`

### 2. Obter Tokens e IDs do Vercel

#### Token de API:
1. Acesse [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Clique em "Create Token"
3. Dê um nome (ex: "GitHub Actions")
4. Copie o token gerado (você só verá uma vez!)

#### Organization ID e Project ID:
1. Acesse as configurações do seu projeto no Vercel
2. Vá em "Settings" → "General"
3. Role até a seção "Project ID" e copie o ID
4. Para o Organization ID, execute no terminal:
   ```bash
   vercel whoami
   ```
   Ou encontre em "Settings" → "Team Settings" → "General"

### 3. Configurar Secrets no GitHub

1. Acesse seu repositório no GitHub
2. Vá em "Settings" → "Secrets and variables" → "Actions"
3. Clique em "New repository secret"
4. Adicione os seguintes secrets:

| Nome | Descrição | Onde encontrar |
|------|-----------|----------------|
| `VERCEL_TOKEN` | Token de API do Vercel | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | ID da sua organização | Settings → General |
| `VERCEL_PROJECT_ID` | ID do projeto | Settings → General |

### 4. Configurar Variáveis de Ambiente no Vercel

No painel do Vercel, vá em "Settings" → "Environment Variables" e adicione:

#### Variáveis Obrigatórias:
```
DATABASE_URL=mysql://user:password@host:3306/database
JWT_SECRET=seu-secret-jwt-aqui
OAUTH_SERVER_URL=https://oauth.manus.im
```

#### Variáveis do Sistema (já configuradas pelo Manus):
- `BUILT_IN_FORGE_API_KEY`
- `BUILT_IN_FORGE_API_URL`
- `OWNER_NAME`
- `OWNER_OPEN_ID`
- `VITE_APP_ID`
- `VITE_APP_TITLE`
- `VITE_APP_LOGO`

**⚠️ IMPORTANTE**: Copie todas as variáveis de ambiente do painel Manus (Settings → Secrets) para o Vercel.

## 🔄 Como Funciona o CI/CD

### Deploy Automático

O workflow é acionado automaticamente quando você:

1. **Push para main/master**: Deploy em produção
   ```bash
   git push origin main
   ```

2. **Abrir Pull Request**: Deploy de preview
   ```bash
   git checkout -b feature/nova-funcionalidade
   git push origin feature/nova-funcionalidade
   # Abra PR no GitHub
   ```

### Etapas do Workflow

1. ✅ **Checkout**: Baixa o código do repositório
2. ✅ **Setup**: Configura Node.js 22 e pnpm
3. ✅ **Cache**: Otimiza instalação de dependências
4. ✅ **Install**: Instala dependências com `pnpm install`
5. ✅ **Test**: Executa testes automatizados
6. ✅ **Build**: Compila o projeto para produção
7. ✅ **Deploy**: Envia para Vercel
8. ✅ **Comment**: Comenta URL de preview em PRs

## 📊 Monitoramento

### Ver Status do Deploy

1. Acesse a aba "Actions" no GitHub
2. Clique no workflow em execução
3. Veja logs detalhados de cada etapa

### Acessar Deploy

- **Produção**: `https://seu-projeto.vercel.app`
- **Preview**: URL comentada automaticamente no PR

## 🐛 Troubleshooting

### Erro: "Missing VERCEL_TOKEN"
- Verifique se o secret `VERCEL_TOKEN` foi adicionado no GitHub

### Erro: "Build failed"
- Verifique os logs no GitHub Actions
- Teste o build localmente: `pnpm build`

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está configurada no Vercel
- Confirme que o banco de dados está acessível

### Deploy bem-sucedido mas site não funciona
- Verifique todas as variáveis de ambiente no Vercel
- Confirme que as variáveis `VITE_*` estão prefixadas corretamente

## 🔐 Segurança

- ✅ Nunca commite secrets no código
- ✅ Use GitHub Secrets para dados sensíveis
- ✅ Configure variáveis de ambiente no Vercel
- ✅ Revise permissões do token de API

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [GitHub Actions Docs](https://docs.github.com/actions)
- [Vercel CLI](https://vercel.com/docs/cli)

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no GitHub Actions
2. Consulte o painel do Vercel
3. Revise as variáveis de ambiente
4. Teste o build localmente

---

**Última atualização**: $(date +%Y-%m-%d)
