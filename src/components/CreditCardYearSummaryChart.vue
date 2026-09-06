<script setup>
  import { onMounted, watch, shallowRef } from 'vue';
  import { colors, bodyColor } from "@/assets/js/utils/colors";
  import {
    Chart,
    BarController,
    BarElement,
    Colors,
    Tooltip,
    CategoryScale,
    LinearScale,
    Legend
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
  });

  function setChartData(data) {
    chart.data.datasets[0].data = data[0];
    chart.data.datasets[1].data = data[1];

    chart.update();
  }

  defineExpose({setChartData});

  onMounted(() => {
    chart = new Chart(chartEl.value, {
      plugins: [Legend],
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
          label: 'Faturas Simuladas',
          data: [],
          backgroundColor: colors.danger
        }, {
          label: 'Faturas Efetivas',
          data: [],
          backgroundColor: colors.warning
        }],
      },
      options: {
        scales: {
          x: {
            ticks: {
              color: bodyColor.dark
            }
          },
          y: {
            ticks: {
              callback: value => `${formatIntToCurrency(value)}`,
              color: bodyColor.dark
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: bodyColor.dark
            }
          },
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
