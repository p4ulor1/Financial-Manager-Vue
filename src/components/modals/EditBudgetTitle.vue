<script setup>
  import ModalTemplate from '@/components/modals/ModalTemplate.vue';
  import { ref, onMounted, shallowRef } from 'vue';

  // dom
  const modalEl = ref(null);
  const budgetTitleEl = ref(null);
  const shortTitleEl = ref(null);
  let updateBudget = null;

  const emit = defineEmits(['editBudgetTitle']);

  function show(budget) {
    updateBudget = {...budget};
    budgetTitleEl.value.value = '';
    budgetTitleEl.value.placeholder = budget.title;
    shortTitleEl.value.classList.add('d-none');

    modalEl.value.show();
  }
  function hide() {
    modalEl.value.hide();
  }
  function isValidForm() {
    let isValid = true;

    // Description validation
    if (budgetTitleEl.value.value.length < 5) {
      shortTitleEl.value.classList.remove('d-none');
      isValid = false;
    }
    else {
      shortTitleEl.value.classList.add('d-none');
    }

    return isValid;
  }
  function submit() {
    if (!isValidForm()) return;

    updateBudget.title = budgetTitleEl.value.value;
    emit('editBudgetTitle', updateBudget);

    hide();
  }

  // EXPOSE METHODS
  defineExpose({
    show
  });

  onMounted(() => {
    // Validar valor R$
    budgetTitleEl.value.addEventListener('input', (evt) => {
      if (budgetTitleEl.value.value > 60)
        budgetTitleEl.value.value = budgetTitleEl.value.value.slice(0, 60);
    });
  });
</script>

<template>
  <ModalTemplate
    ref="modalEl"
    title="Editar Título de Orçamento"
    @modal-cancel="hide"
    @modal-confirm="submit"
  >
    <!-- INVOICE VALUE -->
    <div class="mb-3">
      <label class="form-label">Digite Um Título</label>
      <div class="input-group">
        <input ref="budgetTitleEl" type="text" class="form-control" placeholder="">
      </div>
      <div ref="shortTitleEl" class="form-text text-danger d-none">Título muito curto</div>
    </div>
  </ModalTemplate>
</template>

<style lang="scss" scoped>

</style>
