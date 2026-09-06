<script setup>
  import CreditCard from '@/components/CreditCard.vue';
  import Carousel   from '../../node_modules/bootstrap/js/src/carousel.js';
  import { onMounted, watch, ref, nextTick } from 'vue';

  const props = defineProps({
    title:           {type: String},
    category:        {type: String},
    ride: {type: Boolean, default: false},
    isNotDashbord: {type: Boolean, default: false}
  });
  const emit = defineEmits([
    'carouselSlide',
    'carouselEmpty',
    'editEffectiveInvoiceRequest',
    'createCreditCard',
    'deleteCreditCard',
    'deleteCreditCardRequest'
  ]);
  /**
   * @typedef MonthEffectiveInvoice
   * @property {String} id
   * @property {String} creditCardID
   * @property {String} date
   * @property {Number} value
   *
   * @typedef {Object} CreditCardInfo
   * @property {String} id
   * @property {String} owner
   * @property {String} operator
   * @property {String} last4CardNumbers
   * @property {String} closeDay - Integer type
   * @property {String} dueDay - Integer type
   * @property {Number} simulatedMonthInvoice - Integer type
   * @property {MonthEffectiveInvoice} monthEffectiveInvoice
   *
   * @type {Array<CreditCardInfo>} creditCards
   */
  const creditCardsInfos = ref(null);
  const creditCardCarouselEl = ref(null);
  let carousel = null;
  let nextBgColor = 0;
  let activeCreditCardID = null;

  // METHODS
  function setCreditCardsInfos(creditCards) {
    nextBgColor = 0;

    creditCardsInfos.value = creditCards.map((creditCard, index) => {
      if (nextBgColor > 4)
        nextBgColor = 0;

      return {...creditCard, bgIndex: nextBgColor++}
    });

    if (creditCards.length > 0)
      nextTick(() => {
        document.getElementById('carousel-item-0').classList.add('active');
      });

    activeCreditCardID = creditCardsInfos.value[0].id;
    emit('carouselSlide', activeCreditCardID);
  }
  /**
   * @typedef MonthEffectiveInvoice
   * @property {String} id
   * @property {String} creditCardID
   * @property {String} date
   * @property {Number} value
   *
   * @typedef {Object} CreditCardInvoice
   * @property {String} creditCardID
   * @property {Number} simulatedMonthInvoice
   * @property {MonthEffectiveInvoice} monthEffectiveInvoice
   *
   * @param {Array<CreditCardInvoice>} creditCardsInvoces
   */
  function setInvoices(creditCardsInvoces) {
    creditCardsInvoces.forEach((creditCardInvoices, i) => {
      const currentCreditCardInfos = creditCardsInfos.value
        .filter(creditCardInfos => creditCardInfos.id === creditCardInvoices.creditCardID)[0];

      currentCreditCardInfos.simulatedMonthInvoice = creditCardInvoices.simulatedMonthInvoice;
      currentCreditCardInfos.monthEffectiveInvoice = creditCardInvoices.monthEffectiveInvoice;
    });
  }
  function subtractSimulatedInvoiceValue(creditCardID, value) {
    creditCardsInfos.value
      .filter(creditCardInfos => creditCardInfos.id === creditCardID)[0].simulatedMonthInvoice -= value;
  }
  function addSimulatedInvoiceValue(creditCardID, value) {
    creditCardsInfos.value
      .filter(creditCardInfos => creditCardInfos.id === creditCardID)[0].simulatedMonthInvoice += value;
  }
  function editEffectiveInvoice(creditCardID, _monthEffectiveInvoice) {
    creditCardsInfos.value
      .filter(creditCardInfos => creditCardInfos.id === creditCardID)[0].monthEffectiveInvoice.value = _monthEffectiveInvoice.value
  }
  function addCreditCard(creditCardInfo) {
    if (nextBgColor > 4)
      nextBgColor = 0;

    const createdCreditCard = {...creditCardInfo, bgIndex: nextBgColor++};

    if (creditCardsInfos.value.length > 0)
      creditCardsInfos.value.push(createdCreditCard);
    else
      setCreditCardsInfos([createdCreditCard]);
  }
  function removeCreditCard(creditCardID) {
    const creditCardIndex = creditCardsInfos.value.findIndex(creditCard => creditCard.id === creditCardID);

    creditCardsInfos.value = creditCardsInfos.value
      .filter(creditCardInfos => creditCardInfos.id !== creditCardID);

    // If it is the last carousel item
    if (
      creditCardsInfos.value.length > 0 &&
      creditCardIndex === creditCardsInfos.value.length
    ) {
      nextTick(() => {
        document.getElementById(`carousel-item-0`).classList.add('active');
      });
    }

    // Set new activeCreditCardID
    if (creditCardsInfos.value.length !== 0) {
      activeCreditCardID = creditCardsInfos.value[creditCardIndex % creditCardsInfos.value.length].id;
    }
    else {
      activeCreditCardID = null;
    }

    emit('carouselSlide', activeCreditCardID);
  }
  // EVENTS HANDLERS
  function onEditEffectiveInvoice(monthEffectiveInvoice) {
    emit('editEffectiveInvoiceRequest', monthEffectiveInvoice);
  }
  function onDeleteCreditCardRequest() {
    emit('deleteCreditCardRequest', activeCreditCardID);
  }

  defineExpose({
    setCreditCardsInfos,
    setInvoices,
    subtractSimulatedInvoiceValue,
    addSimulatedInvoiceValue,
    editEffectiveInvoice,
    addCreditCard,
    removeCreditCard
  })

  onMounted(() => {
    carousel = new Carousel('#creditCardCarousel', {
      ride: false
    });

    creditCardCarouselEl.value.addEventListener('slide.bs.carousel', evt => {
      activeCreditCardID = creditCardsInfos.value[evt.to].id;
      emit('carouselSlide', activeCreditCardID);
    });
  });
</script>

<template>
  <div class="card">
    <div class="card-header">
      <p v-if="props.category" class="card-category">{{ props.category }}</p>
      <h2 v-if="props.title" class="card-title">{{ props.title }}</h2>
    </div>
    <div class="card-body">
      <div ref="creditCardCarouselEl" id="creditCardCarousel" class="carousel slide">
        <div class="carousel-inner">
          <div v-if="creditCardsInfos === null" class="spinner-wrapper">
            <div class="spinner-border mx-auto" role="status"></div>
          </div>
          <div v-else-if="creditCardsInfos.length < 1">
            <h4 class="text-center mb-0">Não há Cartões Salvos!</h4>
          </div>
          <div v-else v-for="(creditCardInfos, index) in creditCardsInfos"
            class="carousel-item"
            :id="`carousel-item-${index}`"
          >
            <CreditCard
              @edit-effective-invoice="(rawEffectiveInvoice) => {onEditEffectiveInvoice(rawEffectiveInvoice)}"
              :credit-card-info="creditCardInfos"
              :bg-index="index"
            ></CreditCard>
          </div>
        </div>
      </div>
      <template v-if="creditCardsInfos !== null && creditCardsInfos.length > 1">
        <button class="carousel-control-prev" type="button" data-bs-target="#creditCardCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#creditCardCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </template>
    </div>
    <div v-if="props.isNotDashbord" class="card-footer">
      <div class="btn-wrapper mb-1 mx-0 row">
        <div class="col p-2">
          <div @click="$emit('createCreditCard')" class="_btn">
            <i class="bi bi-credit-card-fill"></i>
            <h5 class="mb-0 ms-2">Adicionar</h5>
          </div>
        </div>
        <div class="col p-2">
          <div @click="onDeleteCreditCardRequest" class="_btn">
            <i class="bi bi-trash3-fill"></i>
            <h5 class="mb-0 ms-2">Remover</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/scss/bs-configuration";
  @use "@/assets/scss/bs-variables";
  $btn-size: 40px;

  .btn-wrapper {
    // display: flex;
    // align-items: center;

    ._btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: $btn-size;
      border-radius: $btn-size;
      @include bs-configuration.gradient-directional(var(--dark), var(--polar-night3), 135deg);
      box-shadow: bs-configuration.$box-shadow;

      i {
        font-size: map-get($map: bs-configuration.$font-sizes, $key: 4);
      }

      .bi-credit-card-fill {
        color: var(--green);
      }

      .bi-trash3-fill {
        color: var(--red);
      }
    }
  }

  button {
    z-index: 3;
  }

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
