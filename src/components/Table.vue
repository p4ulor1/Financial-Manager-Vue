<script setup>
  const props = defineProps({
    category:  {type: String},
    title:     {type: String},
    headers: {type: Array},
    tableData: {type: Array}
  })
</script>

<template>
  <div class="card">
    <div class="card-header">
      <p class="card-category">{{ props.category }}</p>
      <h2 class="card-title">{{ props.title }}</h2>
    </div>
    <div class="card-body table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th v-for="header in props.headers">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-if="props.tableData.length" v-for="row in props.tableData">
            <td v-for="value in row">
              {{ value }}
            </td>
            <td><i class="bi bi-trash3-fill"></i></td>
          </tr>
          <tr v-else>
            <td v-for="column in props.headers">
              <div class="spinner-border spinner-border-sm" role="status"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/scss/bs-variables";

  i {
    color: var(--red);
  }

  td, th {
    white-space: nowrap;
    text-align: center;
  }
</style>
