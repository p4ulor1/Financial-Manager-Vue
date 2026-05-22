<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { getChartGradient } from "@/assets/js/utils/getChartGradient";
  import { float2string } from '@/vueUtils/float2string';
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
  const chartEl = ref(null);
  const props = defineProps({
    category: {},
    title: {},
    chartBgColor: {},
    stepSize: {default: 1000}
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
          data: [],
          label: 'Entrada',
          backgroundColor: context => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            if (!chartArea) return;

            return getChartGradient(ctx, chartArea, `${props.chartBgColor}`, `${props.chartBgColor}80`);
          }
        }]
      },
      options: {
        scales: {
          y: {
            ticks: {
              callback: value => `${float2string(value)}`,
              stepSize: props.stepSize
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
</script>

<template>
  <div class="card card-chart">
    <div class="card-header">
      <p class="card-category">{{ props.category }}</p>
      <h2 class="card-title">{{ props.title }}</h2>
    </div>
    <div class="card-body">
      <canvas class="chart" ref="chartEl"></canvas>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
