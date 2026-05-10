<script setup>
  import CreditCard from '@/components/CreditCard.vue';
  import Carousel   from '../../node_modules/bootstrap/js/src/carousel.js';
  import { onMounted } from 'vue';

  const props = defineProps({
    title:           {type: String},
    category:        {type: String},
    creditCardsInfo: {type: Array, required: true}, // type: [CreditCardInfo]
    ride:            {type: Boolean, default: false}
  });
  const emit = defineEmits(['carousel-slide']);

  onMounted(() => {
    // apagar essa linha
    const creditCardCarousel = document.getElementById('creditCardCarousel');

    new Carousel('#creditCardCarousel', {
      ride: props.ride
    });

    creditCardCarousel.addEventListener('slide.bs.carousel', evt => {
      emit('carousel-slide', props.creditCardsInfo[evt.to]);
    })
  });


</script>

<template>
  <div class="card">
    <div class="card-header">
      <p v-if="props.category" class="card-category">{{ props.category }}</p>
      <h2 v-if="props.title" class="card-title">{{ props.title }}</h2>
    </div>
    <div class="card-body">
      <div id="creditCardCarousel" class="carousel slide">
        <div class="carousel-inner">
          <div v-if="props.creditCardsInfo.length === 0" class="spinner-wrapper">
            <div class="spinner-border mx-auto" role="status"></div>
          </div>
          <div v-else v-for="(creditCardInfo, index) in props.creditCardsInfo"
            class="carousel-item"
            :class="index === 0 ? 'active' : ''"
            :key="index"
          >
            <CreditCard
              :credit-card-info="creditCardInfo"
              :bg-index="index"
            ></CreditCard>
          </div>
        </div>
      </div>
      <template v-if="props.creditCardsInfo.length > 0">
        <button class="carousel-control-prev" type="button" data-bs-target="#creditCardCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#creditCardCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/bs-variables";

  .carousel-item {
    padding: 0 map-get($map: bs-variables.$spacers, $key: 1);
  }

  .card-category {
    margin: 0;
  }

  .spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
</style>
