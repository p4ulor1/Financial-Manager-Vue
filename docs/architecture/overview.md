# Architecture Overview

## 1. Propósito

Este documento prove uma visão de alto nível para a arquitetura da aplicação, seus componentes, suas resposabilidades, e as dependências entre eles.

A aplicação é um gerenciador financeiro pessoal desenvolvido majoritariamente com VueJS e o Apache Cordova para desenvolvimento mobile. A arquitetura é organizada e separada em Presentation, Application, Repository Contracts, e Infrastructure.

Este documento descreve a estrutura arquitetural atual. Detalhes específicos sobre fluxos de uso, decisões de implementação, e modelagem de dados estão documentados separadamente.

---

## 2. Visão Geral Arquitetural

A aplicação é organizada nas seguintes principais areas:

---
title: Overview
---
flowchart TB
    Presentation --> Application
    Application --> Data_access
    Data_access --> Infrastructure

### Presentation

Responsável por exibir as informações e gerenciar a interação com usuário.

Príncipais elementos:

* `views/`
* `components/`
* `layout/`
* `router/`
* `stores/`
* `vueUtils/`

### Application

Contém os casos de uso da aplicação e coordena as operações requisitadas pela camada Application.

Principal elemento:

* `financialManager/useCases/`

### Data Access

Define as interfaces usadas para acesso dos dados da aplicação e provê as implementações dos repositórios concretos.

Príncipais elementos:

* `financialManager/repositories/interfaces/`
* `financialManager/repositories/mocks/`
* `financialManager/repositories/`

Os repositórios Mock estão sendo atualmente usados enquando a camada de persistencia ainda está em desenvolvimento.

### Infrastructure

Contém implementações que dependem de tecnologias externas ou mecânismos de persistencia.

Esta camada foi planejada mas ainda não foi implementada. A ferramenta de banco de dados e sua implementação ainda não foram definidas.

---

## 3. Príncipal fluxo de dependência

O fluxo da interface de usuário para o acesso de dados é:

---
title: Dependency Flow
---
flowchart TB
    View -->|invokes| UseCases
    UseCases -->|uses| RepositoryInterface
    MockRepository -->|implements| RepositoryInterface
    ConcreteRepository -->|implements| RepositoryInterface
    ConcreteRepository -->|uses| Infrastructure
    Infrastructure -->|uses| db[(Database)]

Uma `View` é responsável por criar as dependências exigidas para o seu caso de uso a invocar esses casos de uso em resposta as ações do usuário.

Os Components são elementos de apresentação usados pelas Views para exibir informações e prover a interação com o usuário. Eles não contém regras de négocio.

---

## 4. Composição de Dependências

Atualmente, cada View cria a implementação de repositório e o caso de uso correspondente que é necessário.

Por exemplo:

```js
const repository = new MockExpenseRepository(null);
const useCases = new ExpenseUseCases(repository);
```

Isto significa que a composição de dependência atual ocorre na nível da View.

O caso de uso recebe sua dependência de repositório atráves do construtor por injeção de dependência. Isto permite que o mesmo caso de uso opere com diferentes implementações de repositório, tal como o repositório Mock usado no desenvolvimento ou um repositório concreto que futuramente será implementado.

O projeto atualmente não esta usando um container centralizado de injeção de dependência.

---

## 5. Repositories

Os repositórios prove uma abstração usada pela aplicaç~ao para o acesso persistente de dados ou armazenamento externo de dados.

Os contrados de repositórios estão definidos em:

```text
financialManager/repositories/interfaces/
```

As implementações concretas estão em:

```text
financialManager/repositories/
```

No estágio atual de desenvolvimento, as classes `Mock*Repository` provê os dados consumidos pela aplicação.

A implementação da persistencia de dados foi intencionalmente não incluída no fluxo atual da aplicação. Um repositório concreto e sua dependência da infraestrutura serão introduzidos quando a camada de persistencia for implementada.

---

## 6. Data Model

A modelagem de dados pretendida está documentado separadamente usando UML:

```text
docs/data-model/financialManagerUMLModel.dia
```

O modelo representa a estrutura e os relacionamentos das entidades do banco de dados para a futura camada de persistencia.

Ele não representa a imprementação de um banco de dados.

---

## 7. Princípios de Arquitetura

A arquitetura atual segue os seguintes princípios:

### Separação de responsabilidades

Apresentação, lógica de aplicação, acesso de dados, e infraestrutura são mantidos separadamente.

### Casos de uso como ponto de entrada da aplicação

A Views não implementam as princípais operações da aplicação diretamente. Elas invocam os casos de uso que coordenam as operações.

### Abstração de Repositórios

A lógica da aplicação se comunica com os repositórios atrável de contratos definidos ao invés de serem diretamentes responsáveis pelos detalhes de persistência.

### Injeção de Dependência

As implementações dos repositórios são fornecidas para os casos de uso através dos seus construtures.

### Incremental infrastructure

A persistência de dados e a camada de infraestrutura foram intencionalmente desenvolvidas separadamentes da atual lógica da aplicação. Os repositórios Mock permitem que a aplicação e seus casos de uso sejam desenvolvidos e testados antes que a tecnologia de persistência seja finalizada.

---

## 8. Documentações relacionadas

* `architecture/layers.md` — descrição detalhada de cada camada arquitetural.
* `architecture/dependencies.md` — relação de dependência entre os módulos.
* `architecture/flows/` — fluxo detalhado da aplicação.
* `data-model/financialManagerUMLModel.dia` — representação UML da modelagem de dados.
* `decisions/` — decições arquiteturais e suas relações.
