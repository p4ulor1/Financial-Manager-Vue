<script setup>
  const props = defineProps({
    category: {type: String},
    title: {type: String},
    headers: {type: Array},
    /*
     * @typedef {Object} TableData
     * @property {string} id
     * @property {Array} data
     *
     * @type {Array<TableData>}
     */
    tableData: {type: Object},
    isContribution: {default: false}
  });

  defineEmits(['deleteRow', 'redeemContribution']);
</script>

<template>
  <div class="card">
    <div class="card-header">
      <p class="card-category">{{ props.category }}</p>
      <h2 class="card-title">{{ props.title }}</h2>
    </div>
    <div class="card-body table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th v-for="(header, index) in props.headers">
              <p v-if="index === 0" class="text-start m-0">{{ header }}</p>
              <p v-else-if="index === props.headers.length - 1" class="text-end m-0">{{ header }}</p>
              <p v-else class="text-center m-0">{{ header }}</p>
            </th>
            <th><p class="text-center m-0">Apagar</p></th>
            <th v-if="props.isContribution"><p class="text-center m-0">Resgatar</p></th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-if="props.tableData" v-for="(row, rowIndex) in props.tableData">
            <td v-for="(value, dataIndex) in row.data">
              <p v-if="dataIndex === 0" class="text-start m-0">{{ value }}</p>
              <p v-else-if="dataIndex === props.headers.length - 1" class="text-end m-0">{{ value }}</p>
              <p v-else class="text-center m-0">{{ value }}</p>
            </td>
            <td @click="$emit('deleteRow', props.tableData[rowIndex])">
              <div class="d-flex justify-content-center">
                <i class="bi bi-trash3-fill"></i>
              </div>
            </td>
            <td
              v-if="props.isContribution"
              @click="$emit('redeemContribution', props.tableData[rowIndex])"
            >
              <div class="d-flex justify-content-center">
                <i class="bi bi-cash-coin"></i>
              </div>
            </td>
          </tr>
          <tr v-else>
            <td v-for="column in props.headers">
              <div class="d-flex justify-content-center">
                <div class="spinner-border spinner-border-sm" role="status"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/scss/bs-variables";

  .bi-trash3-fill {
    color: var(--red);
  }

  .bi-cash-coin {
    color: var(--green);
  }

  td, th {
    white-space: nowrap;
  }
</style>
