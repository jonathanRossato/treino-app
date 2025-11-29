# Project TODO

- [x] Criar página de Progresso com gráficos de evolução de carga
- [x] Implementar estatísticas de desempenho e consistência
- [x] Adicionar filtros por período e exercício
- [x] Integrar com dados reais do banco de dados

- [x] Criar página de Histórico de Treinos com cards
- [x] Implementar filtros por data e nome
- [x] Adicionar funcionalidade de edição de treinos
- [x] Adicionar funcionalidade de exclusão de treinos
- [x] Criar modal de edição de treino

- [x] Criar página de Calendário de Treinos
- [x] Implementar visualização mensal com navegação entre meses
- [x] Marcar dias com treinos no calendário
- [x] Exibir detalhes do treino ao clicar em um dia
- [x] Adicionar indicadores visuais de volume/intensidade

- [x] Adicionar estatísticas semanais ao Dashboard
- [x] Implementar comparação com semana anterior
- [x] Alterar exibição de volume de toneladas para quilos em todas as páginas

- [x] Criar tabela de templates de treino no banco de dados
- [x] Implementar rotas tRPC para CRUD de templates
- [x] Criar página de gerenciamento de templates
- [x] Adicionar opção de usar template na página de novo treino
- [x] Corrigir botão "Criar meu diário agora" na página inicial

- [x] Investigar e corrigir sistema de upload de fotos
- [x] Implementar funcionalidade de duplicar treino no histórico
- [x] Adicionar botão de duplicar nos cards de treino
- [x] Testar upload de fotos e duplicação de treinos

- [x] Atualizar esquema do banco de dados para incluir métricas de treino (tempo, sono, FC, calorias)
- [x] Adicionar tabela de cardio no banco de dados
- [x] Criar página de Recordes Pessoais (PRs)
- [x] Implementar comparador de fotos lado a lado
- [x] Expandir formulário de novo treino com campos de métricas
- [x] Adicionar seção de cardio no formulário de treino
- [x] Atualizar visualizações de treino para mostrar novas métricas

- [x] Corrigir modal quebrado na tela de templates
- [x] Adicionar rotas tRPC para buscar dados de cardio
- [x] Implementar gráficos de cardio na página de Progresso
- [x] Testar funcionalidades corrigidas

- [x] Corrigir visibilidade do modal de templates (adicionar overlay escuro e melhorar contraste)

- [x] Criar tabelas de biblioteca de exercícios no banco de dados
- [x] Adicionar GIFs de exercícios populares à pasta public
- [x] Implementar rotas tRPC para exercícios (listar, criar customizado)
- [x] Criar componente de seleção visual de exercícios
- [x] Integrar seletor na página de novo treino
- [x] Integrar seletor na página de templates
- [x] Testar funcionalidade completa

- [x] Adicionar campo de upload de imagem na aba "Criar Novo" do ExercisePicker
- [x] Atualizar rota userExercises.create para aceitar upload de foto/GIF
- [x] Exibir imagens dos exercícios na grid da biblioteca
- [x] Testar upload e visualização de imagens

- [x] Remover aba "Biblioteca" do ExercisePicker
- [x] Remover rotas da biblioteca pré-definida do servidor
- [x] Limpar dados da biblioteca do banco de dados
- [x] Testar funcionalidade apenas com exercícios customizados

- [x] Investigar problema de fuso horário ao salvar data do treino
- [x] Corrigir conversão de data para garantir que a data selecionada seja gravada
- [x] Testar salvamento de treino com diferentes datas

- [x] Adicionar rota userExercises.update no servidor
- [x] Implementar modal de edição de exercício no ExercisePicker
- [x] Adicionar botões de editar e deletar nos cards de exercícios customizados
- [x] Implementar confirmação de exclusão
- [x] Testar edição e exclusão de exercícios

- [x] Corrigir z-index do diálogo de confirmação de exclusão para aparecer acima do modal do ExercisePicker
- [x] Mover diálogo de confirmação para fora do Dialog usando createPortal

- [x] Investigar z-index do shadcn/ui Dialog e aumentar z-index do diálogo de confirmação para valor superior

- [x] Corrigir problema de cliques no diálogo de confirmação usando pointer-events

- [x] Adicionar efeito de press (scale down) nos botões do diálogo de confirmação

- [x] Adicionar seletor de data no registro de fotos
- [x] Adicionar campos de medidas corporais (peso, braço, perna, cintura, peito, etc.)
- [x] Atualizar schema do banco de dados para incluir data e medidas
- [x] Atualizar rotas tRPC para salvar e recuperar medidas
- [x] Testar funcionalidade de registro de fotos com data e medidas

- [x] Adicionar scroll interno ao modal de upload de fotos para tornar todos os campos acessíveis
