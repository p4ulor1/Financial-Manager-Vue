<script setup>
  import InfoCard  from '@/components/InfoCard.vue';
  import ExpenseYearSummaryChart from '@/components/ExpenseYearSummaryChart.vue';
  import Statistic from '@/components/Statistic.vue';
  import Table     from '@/components/Table.vue';

  // variaveis de front end dependentes do dominio
  const statisticData = ['123,45', '123,45', '123,45'];
  const chartData = [
    [123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45], // expenses per month
    [123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45], // invoices per month
    [123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45]  // (expenses + invoices) per month
  ];
  const monthExpense = '123,45'
  const monthInvoice = '123,45'
  const monthTotalExpense = '123,45'
  const tableData = [
    ['description 1', 'Mercado', '01/01/01', '123,34'],
    ['description 2', 'Mercado', '01/01/01', '123,34'],
    ['description 3', 'Mercado', '01/01/01', '123,34']
  ];
</script>

<template>
  <div class="container">
    <section>
      <InfoCard
        category="Despesa"
        sub-info="Total de despesas no mês"
        :icon-color="4"
        :info="monthExpense"
      ></InfoCard>
      <InfoCard
        category="Fatura"
        sub-info="Total da fatura no mês"
        :icon-color="3"
        :info="monthInvoice"
      ></InfoCard>
      <InfoCard
        category="Total"
        sub-info="Soma da despesa com fatura"
        :icon-color="2"
        :info="monthTotalExpense"
      ></InfoCard>
    </section>

    <section>
      <ExpenseYearSummaryChart
        :data="chartData"
        :year="'*year here*'"
      >
      </ExpenseYearSummaryChart>
    </section>

    <section>
      <Table
        :title="'Despesas'"
        :category="'Despesas registradas'"
        :headers="['Descrição', 'Categoria', 'Data', 'Valor']"
        :table-data="tableData"
      ></Table>
    </section>

    <section>
      <Statistic
        :statistics-data="statisticData"
      ></Statistic>
    </section>
  </div>
</template>

<style lang="scss" scoped></style>
