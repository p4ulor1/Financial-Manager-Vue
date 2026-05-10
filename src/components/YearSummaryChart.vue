<script setup>
  import { onMounted, watch, shallowRef } from 'vue';
  import { colors } from "@/assets/js/utils/colors";
  import { float2string } from '@/vueUtils/float2string';
  import annotationPlugin from 'chartjs-plugin-annotation';
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
    LinearScale,
    annotationPlugin
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
          label: 'Entrada',
          data: props.data[0],
          backgroundColor: colors.success
        }, {
          label: 'Despesa',
          data: props.data[1],
          backgroundColor: colors.danger
        }, {
          label: 'Aporte',
          data: props.data[2],
          backgroundColor: colors.warning
        }, {
          label: 'Resultado',
          data: props.data[3],
          backgroundColor: colors.info
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMin: -1000,
            ticks: {
              stepSize: 1000,
              callback: value => `R$ ${value/1000}k`
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
          },
          annotation: {
            annotations: {
              line0: {
                type: 'line',
                yMin: 0,
                yMax: 0,
                borderColor: 'red',
                borderWidth: 1
              }
            }
          }
        }
      }
    });
  });

  watch(() => props.data, () => {
    chart.data.datasets.map((row, index) => {
      row.data = props.data[index];
    })

    chart.update();
  });
</script>

<template>
  <div class="card card-chart">
    <div class="card-header">
      <p class="card-category">Resumo histórico do ano</p>
      <h2 class="card-title">{{ props.year }}</h2>
    </div>
    <div class="card-body">
      <canvas class="chart" ref="chartEl"></canvas>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
