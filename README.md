<h1 style="border: none; text-align: center; margin: .5rem 0;">App de Controle Financeiro</h1>
<h3 style="border: none; text-align: center; margin: .5rem 0;">Paulo Ricardo Silva Moraes</h3>
<h3 style="border: none; text-align: center; margin: .5rem 0;">August 2024</h3>

# Introdução
O aplicativo Controle Financeiro tem como objetivo resolver problemas comuns de organização de finanças, como controle de gastos, ganhos e investimentos.

Ao usar esse aplicativo, o usuário saberá se esta gastando mais do ganha, poderá se organizar da melhor formar e terá mais segurança nas tomadas de decisões sobre sua vida financeira.

O aplicativo vem com uma interface moderna e bem intuitiva facilitando o seu uso.

As informações são exibidas em formas de tabelas e gráficos facilitando a compreensão dos dados.

# Definindo o Projeto
Essa sessão define os padrões que serão utilizados no projeto.

## Nomenclatura
Tabela de nomenclaturas:

| Recurso | Nomenclatura | Exemplo |
| --- | --- | --- |
| Classe | PascalCase | SomeClass |
| Interface | I + PascalCase | ISomeInterface |
| Método, Propriedades | camelCase | someProperty, someMethod() |
| Variáveis | camelCase | someVariable |
| Constantes | Maiúsculas com sublihado | SOME_CONSTANT |

## Regras de négocio

### Escopo Geral
- A aplicação deve gerenciar orçamentos de um usuário;
- A aplicação deve exibir as informações que representa um mês (do dia 1º ao último dia do mês);
- O usuário deve ser capaz de escolher um mês;
- O usuário não deve ser capaz de escoher uma data inferior à data de criação do orçamento;
- O usuário deve ser capaz de manipular transações de orçamento, como entrada, despesa, despesa com cartão e aporte;
- A aplicação deve exibir o saldo do usuário apartir dos dados inseridos;
- A aplicação deve exibir o saldo atual (representa o data corrente) e o saldo previsto (que reflete o saldo apartir do mês selecionado pelo usuário que não seja o mês corrente);

### Identifição das entidades
- **Orçamento:**
  - O orçamento é a entidade principal da aplicação, ela é composta por pelas entidades entrada, despesa, aporte, cartão de crédito e despesas de cartão de crédito;
  - Um orçamento é composto por:
    - Um título curto, com no máximo 30 caracteres;
    - Uma data de criação no formato "2011-10-05".
  - A exclusão de um orçamento deve ocacionar na sua exclusão total, ou seja, a remoção de todas as entidades que compõe o orçamento;
  - O título da entidade deve ser curto, com poucas palavras;

- **Transações de orçamento:**
  - Uma transação de orçamento pode ser representado pelas seguintes entidades: Entrada, Despesa, Despesa com cartão e Aporte;
  - O transação de orçamento é composto por uma descrição curta e objetiva, uma data de criação e o valor;
  - Um transação de orçamento **não pode** possuir uma data inferior a data de criação de um orçamento;
  - O usuário deve ser capaz de:
    - Editar a descrição;
    - Editar a data de transação;
    - Editar o valor da transação;

- **Entrada:**
  - Representa quanto o usuário recebeu em uma data especifica;
  - Além dos atributos de um **Transação de orçamento** uma entrada é composta pelo tipo da entrada;
  - Uma entrada possui um dos tipos de renda a seguir: Renda Trabalho, Renda Extra, Renda Investimentos, Outros;
  - Uma entrada não pode possuir um valor negativo;

- **Aporte:**
  - Representa um valor, que foi separado em uma data especifica, para ser guardado;
  - Um aporte também é composto por um objetivo, que representa o motivo para qual o dinheiro foi guardado;
  - O usuário deve ser capaz de resgatar um aporte;

- **Despesa:**
  - Uma despesa representa o valor gasto em uma data especifíca pelo usuário;
  - Uma despesa também é composta por uma Categoria de despesa;

- **Categoria de despesa:**
  - Representa uma categoria para uma despesa;
  - A aplicação deve conter as seguites categorias pré definidas:
    - Alimentação;
    - Transporte;
    - Saúde e bem estar;
    - Lazer;
    - Educação;
    - Habitação;
    - Demais despesas;
  - O usuário deve ser capaz de criar, editar ou remover uma categoria;
  - Uma categoria é composta por um nome, e uma descrição opicional que define a categoria;

- **Cartão de crédito:**
  - Representa o catão de crédito do usuário;
  - Um cartão de crédito é composto pelo nome do proprietario do cartão, os quatro últimos número do cartão, a data de fechamento do cartão e o dia de vencimento da fatura;

- **Despesa com cartão:**
  - Representa o valor gasto, em uma data específica, com o cartão de crédito;

- **Resultado:**
  - Representa o valor da diferença entre as entradas e as depesas mais os aportes;
  - O resultado é composto de um valor, e da data do mês que ele representa;
  - O valor do resultado deve ser atualizado quando:
    - Uma nova entrada for realizada, editada ou excluída;
    - Quando uma despesa for realizada, editada ou excluída;
    - Quando um aporte for realizado, editado, resgatado ou excluído;
    - Quando uma despesa de cartão for realizada, editada ou excluída;
  - O Resultado de um mês especifico só deve ser criado na existencia de pelo menos uma entidade de Transação de Orçamento;

- **Saldo:**
  - Representa o quanto o usuário possui com base nos dados que são passados;
  - O saldo é composto por um valor e pela data a qual esse valor representa;
  - O valor do saldo deve ser atualizado quando:
    - Uma nova entrada for realizada, editada ou excluída;
    - Quando uma despesa for realizada, editada ou excluída;
    - Quando um aporte for realizado, editado, resgatado ou excluído;
    - Quando uma despesa de cartão for realizada, editada ou excluída;
  - O saldo de um mês especifico só deve ser criado quando houver pelo menos uma entidade de Transação de Orçamento;

# Tecnologias
A lista a seguir descreve as tecnoligias usuadas para o desenvolvimento do app.

- VueJS
- Cordova
- Sqlite
- Vitest
