<script setup>
  import ModalTemplate from '@/components/modals/ModalTemplate.vue';
  import { ref, onMounted } from 'vue';
  import { formatCurrency } from '@/vueUtils/currencyUtils';
  import {
    formatBrDate,
    isValidBrDate,
    formatISOToBrDate
  } from '@/vueUtils/dateUtils';
  import { dateStore } from "@/stores/dateStore";

  // dom
  const modalEl = ref(null);
  const descriptionEl = ref(null);
  const nullDescriptionMsgEl = ref(null);
  const dateEl = ref(null);
  const nullDateMsgEl = ref(null);
  const invDateMsgEl = ref(null);
  const valueEl = ref(null);
  const nullValueMsgEl = ref(null);
  /*
   * Emits
   *
   * @typedef {Object} Contribution
   * @property {string} description
   * @property {string} date - Br Format
   * @property {string} value - Currency Format
   *
   * @typedef {function} createContributionSubmit
   * @returns {Contribution}
  */
  const emit = defineEmits(['createContributionSubmit']);

  function show() {
    // Description
    descriptionEl.value.value = '';
    nullDescriptionMsgEl.value.classList.add('d-none');
    // Date
    dateEl.value.value = formatISOToBrDate(dateStore.toISOString());
    invDateMsgEl.value.classList.add('d-none');
    nullDateMsgEl.value.classList.add('d-none');
    // Value
    valueEl.value.value = '';
    nullValueMsgEl.value.classList.add('d-none');

    modalEl.value.show();
  }
  function hide() {
    modalEl.value.hide();
  }
  function submit() {
    if (!isValidForm()) return;

    emit('createContributionSubmit', {
      description: descriptionEl.value.value,
      date: dateEl.value.value,
      value: valueEl.value.value
    });

    hide();
  }
  function isValidForm() {
    let isValid = true;

    // Description validation
    if (descriptionEl.value.value.length === 0) {
      nullDescriptionMsgEl.value.classList.remove('d-none');
      isValid = false;
    }
    else {
      nullDescriptionMsgEl.value.classList.add('d-none');
    }
    // Date validation
    if (dateEl.value.value.length === 0) {
      nullDateMsgEl.value.classList.remove('d-none');
      invDateMsgEl.value.classList.add('d-none');
      isValid = false;
    }
    else if (!isValidBrDate(dateEl.value.value)) {
      invDateMsgEl.value.classList.remove('d-none');
      nullDateMsgEl.value.classList.add('d-none');
      isValid = false;
    }
    else {
      nullDateMsgEl.value.classList.add('d-none');
      invDateMsgEl.value.classList.add('d-none');
    }
    // Value validation
    if (valueEl.value.value.length === 0) {
      nullValueMsgEl.value.classList.remove('d-none');
      isValid = false;
    }
    else {
      nullValueMsgEl.value.classList.add('d-none');
    }

    return isValid ? true : false;
  }

  // EXPOSE METHODS
  defineExpose({
    show
  });

  onMounted(() => {
    // Validar Data
    dateEl.value.addEventListener('input', (evt) => {
      dateEl.value.value = formatBrDate(dateEl.value.value);
    });
    // Validar valor R$
    valueEl.value.addEventListener('input', (evt) => {
      valueEl.value.value = formatCurrency(valueEl.value.value);
    });
  });
</script>

<template>
  <ModalTemplate
    ref="modalEl"
    title="Adicionar Aporte"
    @modal-cancel="hide"
    @modal-confirm="submit"
  >
    <!-- DESCRIÇÃO -->
    <div class="mb-3">
      <label class="form-label">Digite a Descrição</label>
      <div class="input-group">
        <input  ref="descriptionEl" type="text" class="form-control" placeholder="Descrição">
      </div>
      <div ref="nullDescriptionMsgEl" class="form-text text-danger d-none">Campo Obrigatório</div>
    </div>
    <!-- DATA -->
    <div class="mb-3">
      <label class="form-label">Digite a Data</label>
      <div class="input-group">
        <input ref="dateEl" type="text" class="form-control" placeholder="DD/MM/AAAA" inputmode="numeric">
      </div>
      <div ref="invDateMsgEl" class="form-text text-danger d-none">Data inválida</div>
      <div ref="nullDateMsgEl" class="form-text text-danger d-none">Campo Obrigatório</div>
    </div>
    <!-- VALOR -->
    <div class="mb-3">
      <label class="form-label">Digite o Valor</label>
      <div class="input-group">
        <input ref="valueEl" type="text" class="form-control" placeholder="0,00" inputmode="numeric">
      </div>
      <div ref="nullValueMsgEl" class="form-text text-danger d-none">Campo Obrigatório</div>
    </div>
  </ModalTemplate>
</template>

<style lang="scss" scoped>

</style>
