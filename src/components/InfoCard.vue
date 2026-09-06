<script setup>
  import Card from '@/components/Card.vue';

  const props = defineProps({
    iconColor: {type: Number, default: 0},
    category:  {type: Array, default: ["Card Category"]},
    subInfo:   {type: Array, default: ["Card Sub-Info"]}, // Must have same length of category
    info:      {}, // @type: Array<String>|Array<Null>; Must have same length of category
    icon:      {}
  });
  const iconColorMap = [
    'bg-gradient-success',
    'bg-gradient-primary',
    'bg-gradient-info',
    'bg-gradient-warning',
    'bg-gradient-danger'
  ];
  const iconColorIndex = props.iconColor % iconColorMap.length;
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-4 align-content-center">
          <div :class="['icon', iconColorMap[iconColorIndex]]">
            <slot>
              <i v-if="!props.icon" class="bi bi-plus-lg"></i>
              <i v-else class="bi" :class="props.icon"></i>
            </slot>
          </div>
        </div>
        <div class="col-8">
          <div v-for="(category, index) in props.category" class="mb-1">
            <p class="card-category text-end">{{ category }}</p>
            <div v-if="props.info[index] === null" class="spinner-wrapper">
              <div class="spinner-border" role="status"></div>
            </div>
            <h5 v-else class="card-title text-end">R$ {{ props.info[index] }}</h5>
          </div>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <hr>
      <p v-for="(category, index) in props.category" class="card-category">{{ props.subInfo[index] }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/scss/bs-configuration";
  @use "@/assets/scss/mixins/gradient";

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 100vw;

    i {
      line-height: 100%;
      font-size: bs-configuration.$h2-font-size;
      color: var(--body-color);
    }

    &.icon-warning {
      @include gradient.diagonal-gradient(var(--warning), bs-configuration.$danger);
    }

    &.icon-primary {
      @include gradient.diagonal-gradient(var(--primary), bs-configuration.$purple);
    }

    &.icon-info {
      @include gradient.diagonal-gradient(var(--info), bs-configuration.$blue);
    }

    &.icon-danger {
      @include gradient.diagonal-gradient(var(--danger), bs-configuration.$red);
    }

    &.icon-success {
      @include gradient.diagonal-gradient(var(--success), bs-configuration.$green);
    }
  }

  .card-title,
  .card-category {
    margin: 0;
  }

  .card-footer {
    padding: 0;

    hr {
      margin: map-get($map: bs-configuration.$spacers, $key: 1) 0;
    }
  }

  .spinner-wrapper {
    text-align: end;
    margin-top: map-get($map: bs-configuration.$spacers, $key: 1);
  }
</style>
