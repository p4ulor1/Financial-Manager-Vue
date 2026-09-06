<script setup>
  import { ref, onMounted } from "vue";
  import WaveCard from "@/components/WaveCard.vue";
  import FloatBtn from "@/components/FloatBtn.vue";
  import EditBudgetTitle from "@/components/modals/EditBudgetTitle.vue";
  import CreateBudget from "@/components/modals/CreateBudget.vue";
  import { useRouter } from "vue-router";
  import { formatISOToBrDate } from '@/vueUtils/dateUtils';
  import { budgetIDStore } from '@/stores/budgetIDStore';
  import MockBudgetRepository from '@/financialManager/repositories/MockBudgetRepository';
  import BudgetUseCases from '@/financialManager/useCases/BudgetUseCases';

  const repo = new MockBudgetRepository(null);
  const useCases = new BudgetUseCases(repo);
  const router = useRouter();
  // DOM
  const editBudgetTitleEl = ref(null);
  const createBudgetEl = ref(null);
  // variaveis de front end dependentes do dominio
  const budgets = ref(null);

  /**
   * Abre um orçamento ao click do usuário
   */
  function openBudget(budgeID) {
    budgetIDStore.setBudgetID(budgeID);

    router.push(`/dashboard?id=${budgetIDStore.budgetID}`);
  }
  function onEditBudgetTitle(editBudget) {
    useCases.updateBudgetTitle(editBudget.id, editBudget.title).then(editedBudget => {
      const budgetToEditIndex = budgets.value.findIndex(budget => budget.id === editedBudget.id);

      budgets.value[budgetToEditIndex].title = editedBudget.title;
    });
  }
  function onDeleteBudget(budget) {
    useCases.deleteBudget(budget.id).then(deletedBudget => {
      budgets.value = budgets.value.filter(_budget => _budget.id !== deletedBudget.id);
    });
  }
  function onCreateBudget(createBudget) {
    useCases.createBudget(createBudget).then(createdBudget => {
      budgets.value.push(createdBudget);
    });
  }

  onMounted(() => {
    useCases.getBudgets().then(_budgets => {
      budgets.value = _budgets;
    })
  });
</script>

<template>
  <div class="container">
    <!-- CASE BUDGETS ARE LOADING -->
    <div v-if="budgets === null" class="card d-flex justify-content-center py-5">
      <div class="spinner-border me-2" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <h4 class="text-center mb-0">Buscando...</h4>
    </div>
    <!-- CASE THERE ARE NO BUDGETS -->
    <div v-else-if="budgets.length === 0" class="card py-5">
      <div>
        <h4 class="text-center mb-0">Não há Orçamentos Salvos!</h4>
      </div>
    </div>
    <!-- SHOW BUDGETS -->
    <WaveCard
      v-else
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
        <p @click.stop="editBudgetTitleEl.show(budget)">
          <i style="color: yellow;" class="bi bi-pencil-fill card-icon"></i>
          Editar
        </p>
        <p @click.stop="onDeleteBudget(budget)">
          <i style="color: red;" class="bi bi-trash3-fill card-icon"></i>
          Remover
        </p>
      </div>
    </WaveCard>

    <EditBudgetTitle
      ref="editBudgetTitleEl"
      @edit-budget-title="onEditBudgetTitle"
    ></EditBudgetTitle>

    <CreateBudget
      ref="createBudgetEl"
      @create-budget="onCreateBudget"
    ></CreateBudget>

    <FloatBtn @click="createBudgetEl.show()">
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
