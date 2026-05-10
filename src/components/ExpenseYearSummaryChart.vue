<script setup>
  import { onMounted, watch, shallowRef } from 'vue';
  import { colors } from "@/assets/js/utils/colors";
  import {
    Chart,
    BarController,
    BarElement,
    Colors,
    Tooltip,
    CategoryScale,
    LinearScale
  } from 'chart.js';
  Chart.register(
    BarController,
    BarElement,
    Colors,
    Tooltip,
    CategoryScale,
    LinearScale
  );

  let chart = null;
  const chartEl = shallowRef(null);
  const props = defineProps({
    /**
     * @type [number[]]
     */
    data: {type: Array, default: []},
    year: {}
  });

  onMounted(() => {
    chart = new Chart(chartEl.value, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
          label: "Despesa",
          data: props.data[0],
          backgroundColor: colors.danger
        }, {
          label: "Fatura",
          data: props.data[1],
          backgroundColor: colors.purple
        }, {
          label: "Despesa Total",
          data: props.data[2],
          backgroundColor: colors.info
        }]
      }
    });
  });

  watch(() => props.data, () => {
    chart.data.datasets.map((row, index) => {
      row.data = props.data[index];
    });

    chart.update();
  });
</script>

<template>
  <div class="card card-chart">
    <div class="card-header">
      <p class="card-category">Historico de despesas no ano</p>
      <h2 class="card-title">{{ props.year }}</h2>
    </div>
    <div class="card-body">
      <canvas class="chart" ref="chartEl"></canvas>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
