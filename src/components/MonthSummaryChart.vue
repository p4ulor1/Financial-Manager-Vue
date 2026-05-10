<script setup>
  import { onMounted, watch, shallowRef } from 'vue';
  import { colors } from "@/assets/js/utils/colors";
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
     * @type number[]
     */
    data: {type: Array, default: []}
  });

  onMounted(() => {
    chart = new Chart(chartEl.value, {
      type: 'bar',
      data: {
        labels: ['Entrada', 'Despesa', 'Aporte', 'Resultado'],
        datasets: [{
          data: props.data,
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
          y: {
            ticks: {
              callback: value => `${float2string(value)}`,
              stepSize: 1000
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => {
                return `R$ ${float2string(ctx.parsed.y)}`;
              }
            }
          }
        }
      }
    });
  });

  watch(() => props.data, () => {
    chart.data.datasets[0].data = props.data

    chart.update();
  });
</script>

<template>
  <div class="card card-chart">
    <div class="card-header">
      <p class="card-category">Resultado do Mês</p>
      <h2 class="card-title">Resultado</h2>
    </div>
    <div class="card-body">
      <canvas class="chart" ref="chartEl"></canvas>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
