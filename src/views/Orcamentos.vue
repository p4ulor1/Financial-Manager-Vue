<script setup>
  import { shallowRef } from "vue";
  import WaveCard from "@/components/WaveCard.vue";
  import FloatBtn from "@/components/FloatBtn.vue";
  import { useRouter } from "vue-router";
  import { formatISOToBrDate } from '@/vueUtils/dateUtils';

  const router = useRouter();
  // variaveis de front end dependentes do dominio
  const budgets = [
    {id: 1, title: 'Orçamento 1', creationDate: '2025-01-08'},
    {id: 2, title: 'Orçamento 2', creationDate: '2025-02-08'},
    {id: 3, title: 'Orçamento 3', creationDate: '2025-03-08'},
  ];

  /**
   * Abre um orçamento ao click do usuário
   */
  function openBudget() {
    router.push(`/dashboard`);
  }
</script>

<template>
  <div class="container">
    <WaveCard
      v-for="(budget, index) in budgets"
      :key="budget.id"
      :bg-colors="index"
      class="mb-3"
      @click="openBudget(budget.id)"
    >
      <div class="card-row">
        <p class="card-text">{{ budget.title }}</p>
      </div>
      <div class="card-row">
        <p class="card-text">
          <i class="bi bi-calendar3"></i>
          {{ formatISOToBrDate(budget.creationDate) }}
        </p>
      </div>
      <div class="card-row">
        <p>
          <i style="color: yellow;" class="bi bi-pencil-fill card-icon"></i>
          Editar
        </p>
        <p>
          <i style="color: red;" class="bi bi-trash3-fill card-icon"></i>
          Remover
        </p>
      </div>
    </WaveCard>

    <FloatBtn>
      <i class="bi bi-plus-lg"></i>
    </FloatBtn>
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/scss/bs-configuration";

  .card-row {
    display: flex;
    justify-content: space-between;
  }

  .card-icon {
    font-size: bs-configuration.$h5-font-size;
  }

  .card-text {
    font-size: bs-configuration.$h5-font-size;
  }
</style>
