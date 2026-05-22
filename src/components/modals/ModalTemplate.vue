<script setup>
  import { onMounted, ref, inject } from "vue";
  import { Modal } from "@/assets/js/bootstrapDependecies";

  const modalEl = ref(null);
  let   modal   = null;

  const props = defineProps({
    title: {type: String, required: true}
  });

  defineEmits(['modalCancel', 'modalConfirm']);

  defineExpose({
    show,
    hide
  });

  onMounted(() => {
    modal = new Modal(modalEl.value);
  });

  function show() {
    modal.show();
  }

  function hide() {
    modal.hide();
  }
</script>

<template>
  <div class="modal fade" ref="modalEl" tabindex="-1" data-bs-backdrop="static" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ props.title }}</h3>
          <i class="bi bi-x-lg close-modal" @click="$emit('modalCancel')"></i>
        </div>
        <div class="modal-body">
          <slot>...</slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn bg-gradient-danger" @click="$emit('modalCancel')">Cancelar</button>
          <button type="button" class="btn bg-gradient-success" @click="$emit('modalConfirm')">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/scss/bs-variables";

  .close-modal {
    font-size: map-get($map: bs-variables.$font-sizes, $key: 4);
    margin-left: auto;
  }

  .modal-header h1,
  .modal-header h2,
  .modal-header h3,
  .modal-header h4,
  .modal-header h5,
  .modal-header h6 {
    font-weight: 400;
  }
</style>
