<script setup>
  import ModalTemplate from '@/components/ModalTemplate.vue';
  import { onMounted, ref } from 'vue';

  const modalController = ref(null);
  const monthSelectEl = ref(null);
  const yearSelectEl = ref(null);
  const emit = defineEmits(['modalConfirm', 'modalCancel']);

  onMounted(() => {
    // Set modal start month
    monthSelectEl.value.options[11].selected = true;
  });

  function show() {
    modalController.value.show();
  }

  defineExpose({
    show
  });

  /**
   * Confirm date selection
   */
   function onModalConfirm() {
    const selectedMonth = Number.parseInt(monthSelectEl.value.value);
    const selectedYear  = Number.parseInt(yearSelectEl.value.value);

    emit('modalConfirm');

    modalController.value.hide();
  }

  /**
   * Cancel date selection
   */
  function onModalCancel() {
    emit('modalCancel');

    modalController.value.hide();
  }
</script>

<template>
  <ModalTemplate
      ref="modalController"
      title="Trocar Data"
      @modal-cancel="onModalCancel"
      @modal-confirm="onModalConfirm"
    >
      <div class="mb-3">
        <label for="monthSelect" class="form-label">Selecione o Mes</label>
        <select ref="monthSelectEl" class="form-select" id="monthSelect" aria-label="Default select example">
          <option value="0">Janeiro</option>
          <option value="1">Fevereiro</option>
          <option value="2">Marco</option>
          <option value="3">Abril</option>
          <option value="4">Maio</option>
          <option value="5">Junho</option>
          <option value="6">Julho</option>
          <option value="7">Agosto</option>
          <option value="8">Setembro</option>
          <option value="9">Outubro</option>
          <option value="10">Novembro</option>
          <option value="11">Dezembro</option>
        </select>
      </div>
      <div>
        <label for="yearInput" class="form-label">Selecione o Ano</label>
        <input ref="yearSelectEl" type="text" class="form-control" :value="'*year here*'">
      </div>
    </ModalTemplate>
</template>

<style lang="scss" scoped></style>
