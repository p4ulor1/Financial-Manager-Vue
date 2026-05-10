<script setup>
  import { colors } from '@/assets/js/utils/colors';
  import InfoCard from '@/components/InfoCard.vue';
  import Statistic from '@/components/Statistic.vue';
  import Table from '@/components/Table.vue';
  import FloatBtn  from '@/components/FloatBtn.vue';
  import TrasactionYearSummaryChart from '@/components/TrasactionYearSummaryChart.vue';

  // variaveis de front end dependentes do dominio
  const statisticsData = ['123,45', '123,45', '123,45'];
  const chartData = [123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45];
  const monthContribution = '123.45'
  const tableData = [
    ['Objective 1', '01/01/2026', '123,45'],
    ['Objective 2', '01/01/2026', '123,45'],
    ['Objective 3', '01/01/2026', '123,45'],
  ];
  // end
</script>

<template>
  <div class="container">
    <section>
      <InfoCard
        :icon-color="3"
        :info="monthContribution"
        category="Aporte Total"
        sub-info="Total de aporte no mês"
      ></InfoCard>
    </section>

    <section>
      <TrasactionYearSummaryChart
        category="Histórico de aportes no ano"
        :title="'*year here*'"
        :chart-bg-color="colors.warning"
        :data="chartData"
      ></TrasactionYearSummaryChart>
    </section>

    <section>
      <Table
        category="Tabela de aporte no mês"
        :headers="['Objetivo', 'Data', 'Valor']"
        :table-data="tableData"
      ></Table>
    </section>

    <section>
      <Statistic
        :statistics-data="statisticsData"
      ></Statistic>
    </section>

    <FloatBtn>
      <i class="bi bi-plus-lg"></i>
    </FloatBtn>
  </div>
</template>

<style lang="scss" scoped></style>
