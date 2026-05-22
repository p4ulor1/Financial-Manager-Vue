<script setup>
  import { formatIntToCurrency } from '@/vueUtils/currencyUtils';

  const props = defineProps({
    category:  {type: String},
    title:     {type: String},
    statisticsData:  {type: Array}
  });

  const labels = ['Média do Ano', 'Média nos 12 meses', 'Total no Ano']
</script>

<template>
  <div class="card">
    <div class="card-header">
      <p class="card-category">{{ props.category }}</p>
      <h2 class="card-title">Estatistica</h2>
    </div>
    <div class="card-body">
      <div class="statistic">
        <template v-for="(index) in labels.length">
          <p>
            {{ labels[index - 1] }}:
            <div v-if="!props.statisticsData[index - 1]" class="spinner-border spinner-border-sm" role="status"></div>
            <span v-else>{{ formatIntToCurrency(props.statisticsData[index - 1] * 100) }}</span>
          </p>

          <div v-if="index < (labels.length)" class="hr"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/assets/scss/statistics";
</style>
