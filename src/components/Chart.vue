<script setup>
  import { onMounted, ref, watch } from 'vue';
  import {
    Chart,
    LineController,
    LineElement,
    BarController,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Colors,
    Tooltip
  } from 'chart.js';
  // Chart dependecies
  Chart.register(
    LineController,
    LineElement,
    BarController,
    BarElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Colors,
    Tooltip
  );
  // End chart dependecies

  let chart = null;
  const chartEl = ref(null);
  const props = defineProps({
    title:     {type: String, default: 'Title'},
    category:  {type: String, default: 'Category'},
    type:      {type: String, required: true},  // type: line | bar
    chartData: {type: Object, required: true}, // type: {labels: [string], datasets: []]}]
    options:   {type: Object}
  });

  onMounted(() => {
    chart = chartBuilder(chartEl.value);
  });

  watch(() => props.chartData.datasets, () => {
    updateChart();
  });

  function setDatasets() {
    if (!props.chartData.datasets) return [{}];

    if (props.type === 'line') {
      props.chartData.datasets.forEach(dataset => {dataset.tension = 0.4});
    }
    
    return props.chartData.datasets;
  }

  function chartBuilder(ctx) {
    return new Chart(ctx, {
      type: props.type,
      data: {
        labels: props.chartData.labels,
        datasets: setDatasets()
      },
      options: props.options
    });
  }

  function updateChart() {
    chart.data.datasets = setDatasets();

    chart.update();
  }
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
