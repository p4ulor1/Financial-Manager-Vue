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
  // Owner
  const ownerEl = ref(null);
  const nullOwnerEl = ref(null);
  // Operator
  const operatorEl = ref(null);
  const nullOperatorEl = ref(null);
  // 4 Digits
  const digitsEl = ref(null);
  const nullDigitsEl = ref(null);
  const invDigitsEl = ref(null);
  // CloseDay
  const closeDayEl = ref(null);
  const invCloseDayEl = ref(null);
  const nullCloseDayEl = ref(null);
  // DueDay
  const dueDayEl = ref(null);
  const nullDueDayEl = ref(null);
  const invDueDayEl = ref(null);

  const emit = defineEmits(['createCreditCardSubmit']);

  function show() {
    // Owner
    ownerEl.value.value = '';
    nullOwnerEl.value.classList.add('d-none');
    // Operator
    operatorEl.value.value = '';
    nullOperatorEl.value.classList.add('d-none');
    // 4 Digits
    digitsEl.value.value = '';
    nullDigitsEl.value.classList.add('d-none');
    invDigitsEl.value.classList.add('d-none');
    // CloseDay
    closeDayEl.value.value = '';
    nullCloseDayEl.value.classList.add('d-none');
    invCloseDayEl.value.classList.add('d-none');
    // DueDay
    dueDayEl.value.value = '';
    nullDueDayEl.value.classList.add('d-none');
    invDueDayEl.value.classList.add('d-none');

    modalEl.value.show();
  }
  function hide() {
    modalEl.value.hide();
  }
  function isValidForm() {
    let isValid = true;

    // Owner
    if (ownerEl.value.value.length === 0) {
      nullOwnerEl.value.classList.remove('d-none');
      isValid = false;
    }
    else {
      nullOwnerEl.value.classList.add('d-none');
    }
    // Operator
    if (operatorEl.value.value.length === 0) {
      nullOperatorEl.value.classList.remove('d-none');
      isValid = false;
    }
    else {
      nullOperatorEl.value.classList.add('d-none');
    }
    // 4 Digits
    if (digitsEl.value.value.length === 0) {
      nullDigitsEl.value.classList.remove('d-none');
      invDigitsEl.value.classList.add('d-none');
      isValid = false;
    }
    else if (digitsEl.value.value.length < 4) {
      invDigitsEl.value.classList.remove('d-none');
      nullDigitsEl.value.classList.add('d-none');
      isValid = false;
    }
    else {
      nullDigitsEl.value.classList.add('d-none');
      invDigitsEl.value.classList.add('d-none');
    }
    // closeDay
    if (closeDayEl.value.value.length === 0) {
      nullCloseDayEl.value.classList.remove('d-none');
      invCloseDayEl.value.classList.add('d-none');
      isValid = false;
    }
    else if (!isValidDay(closeDayEl.value.value)) {
      invCloseDayEl.value.classList.remove('d-none');
      nullCloseDayEl.value.classList.add('d-none');
      isValid = false;
    }
    else {
      nullCloseDayEl.value.classList.add('d-none');
      invCloseDayEl.value.classList.add('d-none');
    }
    // dueDay
    if (dueDayEl.value.value.length === 0) {
      nullDueDayEl.value.classList.remove('d-none');
      invDueDayEl.value.classList.add('d-none');
      isValid = false;
    }
    else if (!isValidDay(closeDayEl.value.value)) {
      invDueDayEl.value.classList.remove('d-none');
      nullDueDayEl.value.classList.add('d-none');
      isValid = false;
    }
    else {
      nullDueDayEl.value.classList.add('d-none');
      invDueDayEl.value.classList.add('d-none');
    }

    return isValid;
  }
  function submit() {
    if (!isValidForm()) return;

    emit('createCreditCardSubmit', {
      owner: ownerEl.value.value,
      operator: operatorEl.value.value,
      last4CardNumbers: digitsEl.value.value,
      closeDay: Number.parseInt(closeDayEl.value.value),
      dueDay: Number.parseInt(dueDayEl.value.value)
    });

    hide();
  }
  function isValidDay(day) {
    const parsedDay = Number.parseInt(day);
    return parsedDay > 0 && parsedDay < 32;
  }

  // EXPOSE METHODS
  defineExpose({
    show
  });

  onMounted(() => {
    // Validar digits
    digitsEl.value.addEventListener('input', (evt) => {
      let digits = digitsEl.value.value.slice(0, 4);
      digitsEl.value.value = digits;
    });
    // Validar closeDay
    closeDayEl.value.addEventListener('input', evt => {
      let closeDay = closeDayEl.value.value.slice(0, 2);
      closeDayEl.value.value = closeDay;
    });
    // Validar dueDay
    dueDayEl.value.addEventListener('input', evt => {
      let dueDay = dueDayEl.value.value.slice(0, 2);
      dueDayEl.value.value = dueDay;
    });
  });
</script>

<template>
  <ModalTemplate
    ref="modalEl"
    title="Adicionar Cartão"
    @modal-cancel="hide"
    @modal-confirm="submit"
  >
    <!-- PROPRIETARIO -->
    <div class="mb-3">
      <label class="form-label">Digite o Proprietário</label>
      <div class="input-group">
        <input  ref="ownerEl" type="text" class="form-control" placeholder="Proprietário">
      </div>
      <div ref="nullOwnerEl" class="form-text text-danger d-none">Campo Obrigatório</div>
    </div>
    <!-- OPERADORA -->
    <div class="mb-3">
      <label class="form-label">Digite a Operadora</label>
      <div class="input-group">
        <input  ref="operatorEl" type="text" class="form-control" placeholder="Operadora">
      </div>
      <div ref="nullOperatorEl" class="form-text text-danger d-none">Campo Obrigatório</div>
    </div>
    <!-- 4 DIGITOS -->
    <div class="mb-3">
      <label class="form-label">Digite os 4 últimos digitos</label>
      <div class="input-group">
        <input  ref="digitsEl" type="text" class="form-control" placeholder="1234">
      </div>
      <div ref="invDigitsEl" class="form-text text-danger d-none">Campo inválido</div>
      <div ref="nullDigitsEl" class="form-text text-danger d-none">Campo Obrigatório</div>
    </div>
    <!-- DATA DE FECHAMENTO -->
    <div class="mb-3">
      <label class="form-label">Digite o dia de fechamento da fatura</label>
      <div class="input-group">
        <input ref="closeDayEl" type="text" class="form-control" placeholder="5" inputmode="numeric">
      </div>
      <div ref="invCloseDayEl" class="form-text text-danger d-none">Dia inválida</div>
      <div ref="nullCloseDayEl" class="form-text text-danger d-none">Campo Obrigatório</div>
    </div>
    <!-- DIA DO VENCIMENTO -->
    <div class="mb-3">
      <label class="form-label">Digite o dia de vencimento da fatura</label>
      <div class="input-group">
        <input ref="dueDayEl" type="text" class="form-control" placeholder="10" inputmode="numeric">
      </div>
      <div ref="invDueDayEl" class="form-text text-danger d-none">Dia inválida</div>
      <div ref="nullDueDayEl" class="form-text text-danger d-none">Campo Obrigatório</div>
    </div>
  </ModalTemplate>
</template>

<style lang="scss" scoped>

</style>
