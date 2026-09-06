<script setup>
  import { onMounted, watch, shallowRef } from 'vue';
  import { colors, bodyColor } from "@/assets/js/utils/colors";
  import { getChartGradient } from "@/assets/js/utils/getChartGradient";
  import {
    Chart,
    BarController,
    BarElement,
    Colors,
    Tooltip,
    CategoryScale,
    LinearScale
  } from 'chart.js';
  import { float2string } from '@/vueUtils/float2string';
  import { formatIntToCurrency } from '@/vueUtils/currencyUtils';

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
    title: {type: String, default: ''},
    labels: {type: Array, default: ['Entrada', 'Despesa', 'Aporte', 'Resultado']}
  });

  // METHODS
  function setChartData(data) {
    chart.data.datasets[0].data = data;

    chart.update();
  }

  defineExpose({
    setChartData
  })

  onMounted(() => {
    chart = new Chart(chartEl.value, {
      type: 'bar',
      data: {
        labels: props.labels,
        datasets: [{
          data: [],
          backgroundColor: context => {
            const { chart, index } = context;
            const { ctx, chartArea } = chart;

            if (!chartArea) return;

            const gradientColors = [
              colors.success,
              colors.danger,
              colors.warning,
              colors.info
            ];

            return getChartGradient(ctx, chartArea, `${gradientColors[index]}`, `${gradientColors[index]}80`);
          }
        }]
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
          tooltip: {
            callbacks: {
              label: ctx => {
                return `R$ ${formatIntToCurrency(ctx.parsed.y)}`;
              }
            }
          }
        }
      }
    });
  });

  // watch(() => props.data, () => {
  //   chart.data.datasets[0].data = props.data
  //
  //   chart.update();
  // });
</script>

<template>
  <div class="card card-chart">
    <div class="card-header">
      <p class="card-category">Resultado do Mês</p>
      <h2 class="card-title">{{ props.title }}</h2>
    </div>
    <div class="card-body">
      <canvas class="chart" ref="chartEl"></canvas>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
