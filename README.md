# Calculadora de Descontos — Aula 7 de DevOps

[![CI Pipeline](https://github.com/Dracon-46/Devops_Aula7/actions/workflows/ci.yml/badge.svg)](https://github.com/Dracon-46/Devops_Aula7/actions/workflows/ci.yml)

**Aplicação no ar:** <https://dracon-46.github.io/Devops_Aula7/>

Aplicação React (Vite) que calcula descontos de compra, com **três tipos de
testes automatizados** — unitário, integração e performance — cada um
configurado para rodar e ser analisado de forma independente, e uma pipeline de
CI que executa os três a cada push na `main`.

O projeto parte do exemplo da disciplina
([deivisontakatu/projeto-pipeline-testes](https://github.com/deivisontakatu/projeto-pipeline-testes));
o código da aplicação foi mantido como está. O que a Tarefa 07 pede a mais — a
separação dos três tipos e a apresentação dos resultados — está descrito abaixo.

---

## A regra de negócio

| Valor da compra | Desconto |
| --- | ---: |
| abaixo de R$ 100 | 10% |
| R$ 100 ou mais | 5% |

Valores menores ou iguais a zero são rejeitados com `Error('Valor inválido')`.

---

## Os três tipos de teste

Cada tipo tem **sua própria configuração do Vitest**, com `include` apontando
só para a sua pasta. É isso que permite rodar e analisar um tipo sem executar
os outros:

| Tipo | Pasta | Config | Ambiente | O que valida |
| --- | --- | --- | --- | --- |
| Unitário | `src/tests/unit/` | `vitest.unit.config.js` | `node` | a função `calculateDiscount` isolada |
| Integração | `src/tests/integration/` | `vitest.integration.config.js` | `jsdom` | o componente + o serviço juntos, via interação real |
| Performance | `src/tests/performance/` | `vitest.performance.config.js` | `node` | 10.000 cálculos abaixo de 100ms |

```bash
npm run test:unit           # só os unitários
npm run test:integration    # só os de integração
npm run test:performance    # só os de performance
npm test                    # os três, em sequência
```

Por que cada um roda num ambiente diferente:

- **Unitário** e **performance** rodam em `node`. Não tocam no DOM, e subir o
  `jsdom` só para descartá-lo custa cerca de meio segundo por execução.
- **Integração** precisa de `jsdom` e do plugin do React, porque renderiza o
  componente de verdade e dispara eventos de usuário.
- **Performance** roda ainda com `fileParallelism: false` e um worker só. Medir
  tempo com vários workers disputando CPU no runner produz falha intermitente —
  o teste reprova sem que nada tenha piorado no código.

Cada execução grava um relatório JUnit em `reports/`, que é o que a pipeline
consome para montar o quadro de resultados.

---

## A pipeline

Gatilho exigido pela Tarefa 07:

```yaml
on:
  push:
    branches: [main]
```

```text
push na main
     │
     ▼
┌──────────────────┐
│ qualidade        │  ESLint
└────────┬─────────┘
         ├──────────────┬──────────────┐
         ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ unitário     │ │ integração   │ │ performance  │   (em paralelo)
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       └────────────────┼────────────────┘
                        ├──────────────────────┐
                        ▼                      ▼
              ┌──────────────────┐   ┌──────────────────┐
              │ resultados       │   │ publicar         │
              │ quadro           │   │ build → Pages    │
              │ consolidado      │   └──────────────────┘
              └──────────────────┘
```

Os três tipos rodam em **jobs separados e em paralelo**, cada um com seu próprio
relatório e seu próprio artefato. Duas consequências práticas:

- uma falha no unitário **não esconde** o resultado dos outros dois — na
  execução em um job só, o `npm test` para no primeiro erro e você fica sem
  saber se a integração passaria;
- dá para reexecutar só o tipo que falhou, pelo botão de re-run do job.

### Como os resultados são apresentados

Cada job de teste roda `scripts/resumo-testes.mjs` sobre o seu relatório JUnit e
escreve o resultado em `$GITHUB_STEP_SUMMARY` — ou seja, na própria página da
execução, sem precisar abrir o log. Ao final, o job `resultados` baixa os três
artefatos e monta o quadro consolidado:

```text
| Tipo de teste | Situação  | Testes | Passaram | Falharam | Tempo |
| ------------- | --------- | -----: | -------: | -------: | ----: |
| Unitário      | ✅ passou |      2 |        2 |        0 | 0.00s |
| Integração    | ✅ passou |      1 |        1 |        0 | 0.11s |
| Performance   | ✅ passou |      1 |        1 |        0 | 0.01s |
| Total         | ✅        |      4 |        4 |        0 | 0.12s |
```

Esse job roda com `if: always()`, porque é justamente quando algum tipo falha
que o quadro mais serve — e aí ele também lista, nominalmente, os casos que
falharam.

---

## Estrutura

```text
Devops_Aula7/
├── .github/workflows/ci.yml        # a pipeline
├── scripts/resumo-testes.mjs       # JUnit → tabela Markdown no resumo do job
├── src/
│   ├── components/DiscountDashboard.jsx
│   ├── services/discountService.js # as regras de desconto
│   └── tests/
│       ├── unit/                   # testes unitários
│       ├── integration/            # testes de integração
│       └── performance/            # testes de performance
├── vitest.unit.config.js
├── vitest.integration.config.js
├── vitest.performance.config.js
└── vite.config.js                  # build (base = /Devops_Aula7/)
```

---

## Rodando localmente

```bash
npm install
npm run dev       # aplicação em http://localhost:5173
npm test          # os três tipos de teste
npm run lint      # ESLint
npm run build     # gera dist/
```

---

## O que mudou em relação ao projeto de origem

O código da aplicação (`App.jsx`, `DiscountDashboard.jsx`, `discountService.js`)
e os testes foram mantidos. As mudanças atendem ao enunciado:

| Mudança | Motivo |
| --- | --- |
| três configs do Vitest + scripts `test:unit`, `test:integration`, `test:performance` | "cada tipo de teste possa ser executado e analisado de forma independente" |
| `scripts/resumo-testes.mjs` e o job `resultados` | "apresentar os resultados" |
| um job por tipo de teste, em paralelo | isolar a análise de cada tipo |
| relatórios JUnit como artefato | permitir analisar cada tipo depois da execução |
| `base: '/Devops_Aula7/'` e o job `publicar` | publicação automática no GitHub Pages |
| remoção do `const x=1;` em `discountService.js` | era o exemplo de erro do slide de ESLint; com ele a pipeline reprova em `no-unused-vars` |
| bloco do ESLint para `scripts/**` com globais do Node | sem ele o `.mjs` não era verificado por nenhuma regra |
| `@testing-library/dom` declarado como devDependency | é peer de `@testing-library/react`; sem declarar, a instalação limpa quebra a resolução de dependências |
| remoção de `App.css`, `src/assets/` e `icons.svg` | sobras do template do Vite, nenhum deles importado pelo projeto |

---

## Autor

Arthur Gaspare Camzano — [@Dracon-46](https://github.com/Dracon-46)
Disciplina de DevOps — Tarefa 07.
