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
  import { formatIntToCurrency } from '@/vueUtils/currencyUtils';

  let chart = null;
  const chartEl = shallowRef(null);
  const props = defineProps({
    year: {},
    category: {},
    label: {},
    chartBgColor: {}
  });

  function setChartData(data) {
    chart.data.datasets[0].data = data;

    chart.update();
  }
  function updateChartData(data) {
    chart.data.datasets[0].data = data;

    chart.update();
  }

  defineExpose({setChartData, updateChartData});

  onMounted(() => {
    chart = new Chart(chartEl.value, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
          label: props.label,
          data: [],
          backgroundColor: props.chartBgColor
        }],
      },
      options: {
        scales: {
          y: {
            ticks: {
              callback: value => `${formatIntToCurrency(value)}`
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {label: ctx => `R$ ${formatIntToCurrency(ctx.parsed.y)}`}
          }
        }
      }
    });
  });
</script>

<template>
  <div class="card card-chart">
    <div class="card-header">
      <p class="card-category">{{ props.category }}</p>
      <h2 class="card-title">{{ props.year }}</h2>
    </div>
    <div class="card-body">
      <canvas class="chart" ref="chartEl"></canvas>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
