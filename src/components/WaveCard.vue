<script setup>

  const bgColorsMap = [
    'bg-gradient-primary',
    'bg-gradient-success',
    'bg-gradient-warning',
    'bg-gradient-danger',
    'bg-gradient-info'
  ]
  const props = defineProps({
    bgColors: {type: Number, default: 0}
  });
</script>

<template>
  <div class="wave-card" :class="bgColorsMap[props.bgColors % bgColorsMap.length]">
    <div class="slot-container">
      <slot></slot>
    </div>
    <div class="background">
      <img src="@/assets/img/wave.svg" alt="">
      <img src="@/assets/img/wave(1).svg" alt="">
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use 'sass:map';
  @use "@/assets/scss/bs-configuration";

  .wave-card {
    position: relative;
    padding: map-get($map: bs-configuration.$spacers, $key: 3);
    border-radius: bs-configuration.$border-radius-lg;
    color: var(--snow-storm2);

    .slot-container {
      position: relative;
      z-index: 2;

      * {
        color: map.get(bs-configuration.$nord-colors, "polar-night0");
      }
    }

    .background {
      position: absolute;
      top: 0; bottom: 0; left: 0; right: 0;
      z-index: 1;

      img {
        position:absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: .25;
        border-radius: bs-configuration.$border-radius-lg;
      }
    }
  }

  .bg-gradient-aurora {
    @include bs-configuration.gradient-x(var(--aurora1), var(--aurora0));
  }

  .bg-gradient-frost {
    @include bs-configuration.gradient-x(var(--frost3), var(--frost2));
  }

  .bg-gradient-pink {
    @include bs-configuration.gradient-x(#C8596A, var(--purple));
  }
</style>
