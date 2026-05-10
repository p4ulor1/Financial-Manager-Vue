<script setup>
  import { onMounted, watch, shallowRef } from 'vue';
  import { colors } from "@/assets/js/utils/colors";
  import {
    Chart,
    BarController,
    BarElement,
    Colors,
    Tooltip
  } from 'chart.js';
  Chart.register(
    BarController,
    BarElement,
    Colors,
    Tooltip
  );

  let chart = null;
  const chartEl = shallowRef(null);
  const props = defineProps({
    /**
     * @type [number[]]
     */
    data: {type: Array},
    title:     {type: String, default: 'Title'},
    category:  {type: String, default: 'Category'},
    labels: {default: []},
    datasets: {default: []}
  });

  onMounted(() => {
    chart = new Chart(chartEl.value, {
      type: 'bar',
      data: {
        labels: props.labels,
        datasets: props.datasets
      }
    });
  });

  watch(() => props.data, () => {
    chart.data.datasets.map((row, index) => {
      row.data = props.data[index]
    });

    chart.update();
  })
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
