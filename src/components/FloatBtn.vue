<script setup></script>

<template>
  <div class="floatBtn-wrapper">
    <div class="floatBtn">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
  @use "@/assets/scss/bs-configuration";

  $btn-size: 50px;

  .floatBtn-wrapper {
    position: relative;
    width: $btn-size;
    height: map-get($map: bs-configuration.$spacers, $key: 5);
    margin-left: auto;

    .floatBtn {
      position: fixed;
      bottom: map-get($map: bs-configuration.$spacers, $key: 3);
      width: $btn-size;
      height: $btn-size;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 100vw;
      z-index: 1000;
      @include bs-configuration.gradient-directional(var(--dark), var(--polar-night3), 135deg);
      box-shadow: bs-configuration.$box-shadow;

      i {
        font-size: map-get($map: bs-configuration.$font-sizes, $key: 4);
      }
    }
  }
</style>
