# 🏛️ Architecture Decision Records (ADRs) — Frontend (`escala-elderly`)

> **Projeto:** Escala Elderly — Painel do Gerente & Gestão Inteligente de Escalas  
> **Repositório:** [`escala-elderly`](https://github.com/thomasalmeida09/escala-elderly) (Frontend SPA)  
> **Última Atualização:** 24 de Outubro de 2026  

Este documento registra as **Decisões Arquiteturais (ADRs)** do **Frontend**, divididas em **2 Grupos**:
1. **Grupo 1 — Decisões Já Tomadas no Projeto (V1.0):** O que já foi implementado no repositório inicial, **o porquê (motivação)** e os **trade-offs (vantagens vs. custos/dívidas técnicas)**.
2. **Grupo 2 — Decisões de Governança, Processos e Evolução (Kickoff do Time):** Como gerenciamos tarefas, padrão de formatação de código, Continuous Integration (CI), Pull Requests (PRs) e escopo das Sprints.

### 🖼️ Visualização Interativa das ADRs no PR Lens
- 🏗️ **[Canvas Arquitetura Completa & ADRs (4 Diagramas + Walkthrough)](https://prlens.dev/c/L-2rShWu_j0WpKt-jT0Cog)**
- 👶 **[Canvas ELI5 — Como o Escala Elderly Resolve uma Falta (Onboarding Visual)](https://prlens.dev/c/x2StISYcAmXvy49MhetrsQ)**

[![Arquitetura Escala Elderly — PR Lens](https://prlens.dev/c/L-2rShWu_j0WpKt-jT0Cog.svg)](https://prlens.dev/c/L-2rShWu_j0WpKt-jT0Cog)

---

## 📗 GRUPO 1: Decisões Já Tomadas no Frontend (`STATUS: ACEITA / IMPLEMENTADA NA V1.0`)

---

### 📌 ADR-FE-001: Arquitetura de Repositórios Separados (SPA Frontend Desacoplada da API REST)
- **Status:** `ACEITA / IMPLEMENTADA`
- **Contexto:** O sistema precisa de uma interface rica para o gestor da clínica de idosos e de uma API backend em Java.
- **Decisão:** Manter o Frontend em um repositório próprio (`escala-elderly`), comunicando-se via HTTP/JSON com o repositório `escala-elderly-backend`.
- **Por quê (Motivação):**
  - Permite que os desenvolvedores de Frontend rodem e testem a interface imediatamente com `bun run dev`, sem precisar subir o servidor Java/Gradle para validar layout e interações de tela.
- **Trade-offs (Vantagens vs. Custos Assumidos):**
  - ✅ **Vantagens:** Ciclo de desenvolvimento visual ultrarrápido; zero acoplamento de build entre Node/Bun e Gradle/JVM.
  - ⚠️ **Custos / Cuidados:** Exige manter o **Contrato JSON (`interface Cuidador`)** sincronizado manualmente com a classe `Cuidador.java` do Backend para evitar divergências de IDs e nomes de campos.

---

### 📌 ADR-FE-002: Stack Tecnológica — React 19 + TypeScript 6 + Vite 8 + Bun
- **Status:** `ACEITA / IMPLEMENTADA`
- **Onde está no código:** [`package.json`](../../package.json), [`vite.config.ts`](../../vite.config.ts), [`tsconfig.app.json`](../../tsconfig.app.json) e [`bun.lock`](../../bun.lock).
- **Decisão:** Utilizar **React 19** com **TypeScript estrito**, empacotado pelo **Vite 8** e gerenciado pelo **Bun**.
- **Por quê (Motivação):**
  - O Vite entrega *Hot Module Replacement (HMR)* instantâneo; o TypeScript previne erros de propriedades nulas ou tipos incorretos em tempo de compilação (`tsc -b`); e o Bun instala dependências em frações de segundo.
- **Trade-offs (Vantagens vs. Custos Assumidos):**
  - ✅ **Vantagens:** Produtividade máxima, bundle enxuto e tipagem forte nos componentes e hooks.
  - ⚠️ **Custos / Cuidados:** Toda a equipe deve utilizar `bun install` (evitando misturar `package-lock.json` do npm com o `bun.lock`).

---

### 📌 ADR-FE-003: Design System Baseado em Material UI (`@mui/material`) com Tema `"Warm Care + Tech Industrial"` e Arquivos `.styles.ts`
- **Status:** `ACEITA / IMPLEMENTADA`
- **Onde está no código:** [`src/theme/theme.ts`](../../src/theme/theme.ts), [`src/App.tsx`](../../src/App.tsx), [`src/pages/Dashboard.styles.ts`](../../src/pages/Dashboard.styles.ts) e [`src/components/CardCuidador/CardCuidador.styles.ts`](../../src/components/CardCuidador/CardCuidador.styles.ts).
- **Decisão:** Adotar o **Material UI v9 (`@mui/material` + Emotion)** como biblioteca única de componentes e estilização, isolando os objetos de estilo (`sx`) em arquivos `.styles.ts` dedicados e aplicando a paleta customizada `warmCareTheme` (`#F9F8F6` Off-White, `#007A78` Verde Esmeralda e `#D97706` Âmbar de Alerta).
- **Por quê (Motivação):**
  - Transmitir acolhimento hospitalar (*Warm Care*) combinado com precisão de painel de monitoramento (*Tech Industrial* com fonte monoespaçada `JetBrains Mono`), mantendo os arquivos `.tsx` limpos de blocos extensos de CSS.
- **Trade-offs (Vantagens vs. Custos Assumidos):**
  - ✅ **Vantagens:** Identidade visual autoral, fácil manutenção de cores via tokens do `theme.ts` e componentes `.tsx` curtos e legíveis.
  - ⚠️ **Dívida Técnica Mapeada (Resolvida na Issue #1):** Inicialmente o `tailwindcss` foi adicionado ao `package.json`, porém ficou inativo (`postcss.config.js` vazio). Para evitar mistura de dois sistemas de estilo concorrentes, oficializamos **100% Material UI (`.styles.ts`)** e removemos os arquivos inativos do Tailwind e o CSS residual do template Vite.

---

### 📌 ADR-FE-004: Desacoplamento de Estado e Lógica via Custom Hooks (`useCaregivers`)
- **Status:** `ACEITA / IMPLEMENTADA`
- **Onde está no código:** [`src/hooks/useCaregivers.ts`](../../src/hooks/useCaregivers.ts) e [`src/pages/Dashboard.tsx`](../../src/pages/Dashboard.tsx).
- **Decisão:** Extrair todo o gerenciamento de estado (`cuidadores`, `loading`) e mutações de negócio (`simularFaltaDoCarlos`) para dentro de Custom Hooks em `src/hooks/`, deixando os componentes em `src/pages/` e `src/components/` focados apenas em apresentação.
- **Por quê (Motivação):**
  - Permite trocar a fonte de dados (do mock `Caregive.json` para `localStorage` + API Spring Boot) alterando apenas o hook `useCaregivers.ts`, sem quebrar nenhum componente visual.
- **Trade-offs (Vantagens vs. Custos Assumidos):**
  - ✅ **Vantagens:** Código modular, fácil de testar e com responsabilidade única clara.
  - ⚠️ **Custos / Cuidados:** Na versão V1.0 o estado vive apenas em memória (`useState`), perdendo alterações no `F5` — o que será evoluído na **Issue #2** com persistência *Local-First*.

---

### 📌 ADR-FE-005: Abordagem "Bottom-Up" Focada na Simulação Visual do Furo de Escala
- **Status:** `ACEITA / IMPLEMENTADA`
- **Onde está no código:** [`src/components/SimuladorPainel/SimuladorPainel.tsx`](../../src/components/SimuladorPainel/SimuladorPainel.tsx) e [`src/components/CardCuidador/CardCuidador.tsx`](../../src/components/CardCuidador/CardCuidador.tsx).
- **Decisão:** Começar o produto diretamente pelo **Painel de Monitoramento do Gerente** e pela simulação em 1 clique da **"Falta de Carlos"**, sem exigir telas prévias de login ou cadastros extensos.
- **Por quê (Motivação):**
  - Validar imediatamente a dor central mapeada no Onboarding: dar visibilidade instantânea quando um cuidador falta.
- **Trade-offs (Vantagens vs. Custos Assumidos):**
  - ✅ **Vantagens:** Demonstração imediata de valor em menos de 3 segundos de uso.
  - ⚠️ **Custos / Cuidados:** Exige na Sprint 2 evoluir do simples alerta visual (`FALTOU`) para a **ação de resolução** (sugerir folguista substituto e acionar via WhatsApp).

---

## 📙 GRUPO 2: Decisões de Governança e Evolução do Frontend (`STATUS: DEFINIDAS PARA INÍCIO DAS SPRINTS`)

---

### 🗳️ ADR-FE-006: Escopo do Frontend Dividido em 3 Sprints Evolutivas
- **Pergunta:** *"Qual o escopo do projeto no Frontend?"*
- **Decisão:** Dividir a construção em **3 ondas incrementais** para garantir entregas rápidas e sem conflito de código entre os membros do time:
  1. **🟢 Sprint 1 (`sprint-1: fundacao` — Issues [#1](https://github.com/thomasalmeida09/escala-elderly/issues/1), [#2](https://github.com/thomasalmeida09/escala-elderly/issues/2) e [#9](https://github.com/thomasalmeida09/escala-elderly/issues/9)):**
     - Limpeza do CSS residual do Vite, importação das fontes `Inter` e `JetBrains Mono`, correção do typo `"DASHBOARD"`, configuração do Prettier/CI e conexão do `useCaregivers.ts` com a API Spring Boot + persistência **Local-First (`localStorage`)**.
  2. **🔵 Sprint 2 (`sprint-2: mvp-core` — Issues [#3](https://github.com/thomasalmeida09/escala-elderly/issues/3), [#4](https://github.com/thomasalmeida09/escala-elderly/issues/4) e [#7](https://github.com/thomasalmeida09/escala-elderly/issues/7)):**
     - **Cobertura Inteligente de Falta (#7):** Sugerir quem pode cobrir o turno (folguistas com descanso $\ge 11\text{h}$ CLT) + botão de acionamento rápido via WhatsApp (`wa.me`);
     - **Importação/Exportação de Planilha CSV (#3):** Preenchimento da escala em 1 segundo e backup Local-First;
     - **Exportação da Escala em PDF A4 Vetorial (#4):** Impressão direta para o mural da enfermaria e envio no WhatsApp.
  3. **🟣 Sprint 3 (`sprint-3: evolucao` — Issues [#5](https://github.com/thomasalmeida09/escala-elderly/issues/5), [#6](https://github.com/thomasalmeida09/escala-elderly/issues/6) e [#8](https://github.com/thomasalmeida09/escala-elderly/issues/8)):**
     - Barra de KPIs e termômetro de economia financeira no topo (#8), Modo Privacidade LGPD (#6) e sincronização multiplayer em tempo real via `BroadcastChannel` + `SSE` (#5).

---

### 🗳️ ADR-FE-007: Gestão de Tarefas via GitHub Issues + GitHub Projects (Kanban Unificado)
- **Pergunta:** *"Como vamos gerenciar as tarefas?"*
- **Decisão:** Utilizar **GitHub Issues** conectadas a um quadro único no **GitHub Projects** integrando Frontend e Backend, estruturado em 5 colunas:
  - `📋 Backlog (Sprint 2 & 3)` $\rightarrow$ `🎯 Sprint 1 (To Do)` $\rightarrow$ `🔨 In Progress` $\rightarrow$ `👀 In Review (PR)` $\rightarrow$ `✅ Done`
- **Regra Operacional:** Nenhuma funcionalidade é codada sem uma Issue associada e atribuída (`Assignee`) ao desenvolvedor responsável.

---

### 🗳️ ADR-FE-008: Padrão de Formatação de Código e Linting no Frontend
- **Pergunta:** *"Qual o padrão de formatação do código?"*
- **Decisão:**
  1. **Linter:** Manter o **ESLint 10 (`eslint.config.js`)** validando regras de React Hooks, React Refresh e TypeScript.
  2. **Formatador Automático:** Adotar **Prettier** (`.prettierrc`) com:
     - `singleQuote: true`, `semi: true`, `tabWidth: 2`, `trailingComma: "es5"`, `printWidth: 100`.
  3. **EditorConfig (`.editorconfig`):** Padronizar `charset = utf-8` e `end_of_line = lf` para evitar conflitos de quebra de linha entre Windows (`CRLF`) e Linux/Mac (`LF`).
  4. **Convenção de Pastas e Nomes:**
     - Componentes em `PascalCase` com estilos isolados (`NomeComponente.tsx` + `NomeComponente.styles.ts`);
     - Hooks em `camelCase` iniciados por `use` (`useCaregivers.ts`);
     - Módulos puros de negócio em `src/core/` ou `src/services/`.

---

### 🗳️ ADR-FE-009: Continuous Integration (CI) no Frontend com GitHub Actions
- **Pergunta:** *"Como vai funcionar o Continuous Integration?"*
- **Decisão:** Executar automaticamente o workflow `.github/workflows/ci.yml` em todo `push` e `pull_request` para a branch `main`, rodando:
  1. `bun install --frozen-lockfile`
  2. `bun run lint` (verifica erros de código/ESLint)
  3. `bun run build` (`tsc -b && vite build` — garante que o TypeScript compila sem erros e gera o bundle de produção).
- **Trade-off:** Bloqueia automaticamente o merge de qualquer PR que quebre a compilação ou a tipagem do projeto.

---

### 🗳️ ADR-FE-010: Governança de Branches, Commits e Pull Requests (PRs)
- **Pergunta:** *"Como vão ser os PRs?"*
- **Decisão:**
  1. **Branch `main` Protegida:** Proibido `push` direto na `main`. Toda entrega é feita via branch curta (`feat/issue-02-local-first`, `fix/issue-01-css-vite`).
  2. **Conventional Commits:** Mensagens padronizadas com prefixo semântico (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `ci:`).
  3. **Regras de Merge do PR:**
     - PR focado em **1 única Issue** (referenciada com `Closes #Número` na descrição);
     - **CI Verde** no GitHub Actions;
     - **Pelo menos 1 aprovação (Code Review)** de outro integrante da equipe;
     - Estratégia **Squash and Merge**.

---

### 🗳️ ADR-FE-011: Arquitetura Local-First com Sincronização Resiliente e Contrato JSON Unificado
- **Decisão:**
  - O Frontend sempre salva e lê instantaneamente do armazenamento local do navegador (`localStorage` / `IndexedDB`) e sincroniza com a API Spring Boot (`http://localhost:8080/api/cuidadores`) quando disponível.
  - **Contrato JSON Canônico compartilhado com o Backend:**
    ```ts
    export type StatusCuidador = 'Presente' | 'Faltou' | 'Folga' | 'Cobertura';

    export interface Cuidador {
      id: number;          // Ex: 3 = Carlos Rocha (unificado no Front e no Back)
      nome: string;
      status: StatusCuidador;
      turno?: string;      // Ex: "Diurno (07h-19h)" | "Noturno (19h-07h)"
      quarto?: string;     // Ex: "Quarto 03"
      telefone?: string;
    }
    ```
