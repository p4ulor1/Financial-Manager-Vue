<script setup>
  import ModalTemplate from '@/components/modals/ModalTemplate.vue';
  import { ref, onMounted, shallowRef } from 'vue';
  import { formatCurrency, formatIntToCurrency, formatCurrencyToInt } from '@/vueUtils/currencyUtils';
  import {
    formatBrDate,
    isValidBrDate,
    formatISOToBrDate
  } from '@/vueUtils/dateUtils';
  import { dateStore } from "@/stores/dateStore";

  // dom
  const modalEl = ref(null);
  const invoiceValueEl = ref(null);
  const nullInvoiceValueEl = ref(null);
  let monthEffectiveInvoice = null;

  const emit = defineEmits(['editEffectiveInvoice']);

  function show(_monthEffectiveInvoice) {
    monthEffectiveInvoice = _monthEffectiveInvoice;
    invoiceValueEl.value.value = formatIntToCurrency(_monthEffectiveInvoice.value);
    nullInvoiceValueEl.value.classList.add('d-none');

    modalEl.value.show();
  }
  function hide() {
    modalEl.value.hide();
  }
  function isValidForm() {
    let isValid = true;

    // Description validation
    if (invoiceValueEl.value.value.length === 0) {
      nullInvoiceValueEl.value.classList.remove('d-none');
      isValid = false;
    }
    else {
      nullInvoiceValueEl.value.classList.add('d-none');
    }

    return isValid;
  }
  function submit() {
    if (!isValidForm()) return;

    emit('editEffectiveInvoice', {
      id: monthEffectiveInvoice.id,
      creditCardID: monthEffectiveInvoice.creditCardID,
      date: monthEffectiveInvoice.date,
      value: formatCurrencyToInt(invoiceValueEl.value.value)
    });

    hide();
  }

  // EXPOSE METHODS
  defineExpose({
    show
  });

  onMounted(() => {
    // Validar valor R$
    invoiceValueEl.value.addEventListener('input', (evt) => {
      invoiceValueEl.value.value = formatCurrency(invoiceValueEl.value.value);
    });
  });
</script>

<template>
  <ModalTemplate
    ref="modalEl"
    title="Editar Fatura Efetiva"
    @modal-cancel="hide"
    @modal-confirm="submit"
  >
    <!-- INVOICE VALUE -->
    <div class="mb-3">
      <label class="form-label">Digite o Valor da Fatura</label>
      <div class="input-group">
        <input ref="invoiceValueEl" type="text" class="form-control" placeholder="0,00">
      </div>
      <div ref="nullInvoiceValueEl" class="form-text text-danger d-none">Campo Obrigatório</div>
    </div>
  </ModalTemplate>
</template>

<style lang="scss" scoped>

</style>
