<script setup>
  import InfoCard  from '@/components/InfoCard.vue';
  import Statistic from '@/components/Statistic.vue';
  import FloatBtn  from '@/components/FloatBtn.vue';
  import Table     from '@/components/Table.vue';
  import TrasactionYearSummaryChart from '@/components/TrasactionYearSummaryChart.vue';
  import { computed, ref, shallowRef } from 'vue';
  import { colors } from '@/assets/js/utils/colors';
  import { float2string } from '@/vueUtils/float2string';
  import { viewDateParse } from '@/vueUtils/viewDateParse';

  // variaveis de front end dependentes do dominio
  const statisticsData = [123.45, 123.45, 123.45];
  const chartData = [3200, 3100, 3300, 3400, 3200, 3500, 3300, 3400, 3200, 3500, 3400, 3200];
  const monthIncome = '123,45';
  const tableData = [
    ['description 1', 'Renda Trabalho', '01/01/01', '123,34'],
    ['description 2', 'Renda Trabalho', '01/01/01', '123,34'],
    ['description 3', 'Renda Trabalho', '01/01/01', '123,34']
  ];
</script>

<template>
  <div class="container">
    <!-- Month Summary -->
    <section>
      <InfoCard
        :icon-color="0"
        :info="monthIncome"
        category="Entrada"
        sub-info="Total de entrada no mês"
      ></InfoCard>
    </section>

    <!-- Historic chart -->
    <section>
      <TrasactionYearSummaryChart
        category="Historico de Entradas no ano"
        :title="'*year here*'"
        :chart-bg-color="colors.success"
        :data="chartData"
      ></TrasactionYearSummaryChart>
    </section>

    <!-- Incomes Details -->
    <section>
      <Table
        category="Tabela de entradas no mês"
        :headers="['Descrição', 'Tipo de Entrada', 'Data', 'Valor']"
        :table-data="tableData"
      ></Table>
    </section>

    <!-- Statistics -->
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
