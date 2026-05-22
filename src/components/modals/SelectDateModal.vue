<script setup>
  import ModalTemplate from '@/components/modals/ModalTemplate.vue';
  import { onMounted, ref, computed } from 'vue';
  import { parseISODate } from '@/vueUtils/dateUtils';
  import { dateStore } from '@/stores/dateStore';

  const modalController = ref(null);
  const monthSelectEl = ref(null);
  const yearSelectEl = ref(null);
  const invYearMsgEl = ref(null);
  const nullYearMsgEl = ref(null);
  const date = computed(() => {
    return dateStore.toISOString();
  });
  const emit = defineEmits(['modalConfirm']);

  function show() {
    const parsedDate = parseISODate(dateStore.toCurrentISOString());
    // Set to inputs
    monthSelectEl.value.selectedIndex = parsedDate.month - 1;
    yearSelectEl.value.value = '';
    invYearMsgEl.value.classList.add('d-none');
    nullYearMsgEl.value.classList.add('d-none');

    modalController.value.show();
  }
  function setDate() {
    if (yearSelectEl.value.value.length === 0) {
      nullYearMsgEl.value.classList.remove('d-none');
      invYearMsgEl.value.classList.add('d-none');
      return;
    }
    if (yearSelectEl.value.value.length < 4) {
      invYearMsgEl.value.classList.remove('d-none');
      nullYearMsgEl.value.classList.add('d-none');
      return;
    }

    const day = parseISODate(date.value).day;
    dateStore.setDate(`${yearSelectEl.value.value}-${monthSelectEl.value.value}-${day}`);

    hide();
  }
  function hide() {
    modalController.value.hide();
  }

  defineExpose({
    show
  });

  onMounted(() => {
    const parsedDate = parseISODate(dateStore.toCurrentISOString());
    yearSelectEl.value.placeholder = parsedDate.year;

    // Filter year input
    yearSelectEl.value.addEventListener('input', (evt) => {
      let year = yearSelectEl.value.value.replace(/\D/g, '');
      year = year.replace(/0(?=\d{3})/g, '');
      if (year.length > 4) year = year.substring(0, 4);
      yearSelectEl.value.value = year;
    })
  });
</script>

<template>
  <ModalTemplate
      ref="modalController"
      title="Trocar Data"
      @modal-cancel="hide"
      @modal-confirm="setDate"
    >
      <div class="mb-3">
        <label for="monthSelect" class="form-label">Selecione o Mes</label>
        <select ref="monthSelectEl" class="form-select">
          <option value="01">Janeiro</option>
          <option value="02">Fevereiro</option>
          <option value="03">Marco</option>
          <option value="04">Abril</option>
          <option value="05">Maio</option>
          <option value="06">Junho</option>
          <option value="07">Julho</option>
          <option value="08">Agosto</option>
          <option value="09">Setembro</option>
          <option value="10">Outubro</option>
          <option value="11">Novembro</option>
          <option value="12">Dezembro</option>
        </select>
      </div>
      <div>
        <div class="mb-3">
          <label for="yearInput" class="form-label">Digite o Ano</label>
          <input ref="yearSelectEl" type="text" class="form-control" placeholder="AAAA">
          <div ref="nullYearMsgEl" class="form-text text-danger d-none">Campo Obrigatório</div>
          <div ref="invYearMsgEl" class="form-text text-danger d-none">Ano Incorreto</div>
        </div>
      </div>
    </ModalTemplate>
</template>

<style lang="scss" scoped></style>
