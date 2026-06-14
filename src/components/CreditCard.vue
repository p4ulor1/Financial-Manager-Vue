<script setup>
  import WaveCard from '@/components/WaveCard.vue';
  import { formatIntToCurrency } from '@/vueUtils/currencyUtils';

  const props = defineProps({
    bgIndex: {type: Number, default: 0},
    /**
     * @typedef {Object} CreditCardInfo
     * @property {String} last4CardNumbers
     * @property {String} owner
     * @property {String} operator
     * @property {Number} simulatedInvoice - Integer type
     * @property {Number} effectiveInvoice - Integer type
     * @property {Number} closeDate - Integer type
     * @property {Number} dueDate - Integer type
     *
     * @type CreditCardInfo
     */
    creditCardInfo:  {type: Object, required: true}
  });

  // METHODS
  function intToString(int) {
    return int < 10 ? `0${int}` : `${int}`;
  }
</script>

<template>
  <WaveCard :bg-colors="props.bgIndex">
    <div class="row">
      <div class="col">
        <div class="logo">
          <img src="@/assets/img/logo.png" alt="credit-card-logo">
        </div>
      </div>
      <div class="col">
        <h6>{{ props.creditCardInfo.operator }}</h6>
      </div>
      <div class="col">
        <div class="chip">
          <img src="@/assets/img/chip.png" alt="credit-card-chip-illustration">
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="credit-card-number">
          <p>Numero do Cartao:</p>
          <h6>**** **** **** {{ props.creditCardInfo.last4CardNumbers }}</h6>
        </div>

        <h6 class="name">{{ props.creditCardInfo.owner }}</h6>
      </div>
    </div>

    <div class="row mb-1">
      <div class="col">
        <p>Fatura Simulada:</p>
        <h6>R$ {{ formatIntToCurrency(props.creditCardInfo.simulatedInvoice) }}</h6>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div>
          <p>Fatura Efetiva:</p>
          <h6>R$ {{ formatIntToCurrency(props.creditCardInfo.effectiveInvoice) }}</h6>
        </div>
      </div>
      <div class="col">
        <div class="card-info">
          <div>
            <p>Fech</p>
            <h6>{{ intToString(props.creditCardInfo.closeDate) }}</h6>
          </div>

          <div>
            <p>Venc</p>
            <h6>{{ intToString(props.creditCardInfo.dueDate) }}</h6>
          </div>
        </div>
      </div>
    </div>
  </WaveCard>
</template>

<style lang="scss" scoped>
  @use "@/assets/scss/bs-configuration";

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    white-space: nowrap;
  }

  .row {
    align-items: center;

    &:nth-child(2) {
      margin: map-get($map: bs-configuration.$spacers, $key: 3) 0;
    }

    .logo {
      width: 48px;
      margin-right: auto;

      img {
        width: 100%;
      }
    }

    .chip {
      width: 48px;
      margin-left: auto;

      img {
        width: 100%;
      }
    }

    .credit-card-number {
      p {
        font-size: calc(1rem * 0.75);
      }
    }

    .card-info {
      display: flex;
      gap: calc(1rem);
      justify-content: flex-end;

      p {
        text-align: end;
      }
    }
  }
</style>
