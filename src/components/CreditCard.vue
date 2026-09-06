<script setup>
  import WaveCard from '@/components/WaveCard.vue';
  import { computed } from 'vue';
  import { formatIntToCurrency } from '@/vueUtils/currencyUtils';
  import { parseISODate } from '@/vueUtils/dateUtils';
  import { dateStore } from '@/stores/dateStore';
  import { toRaw } from 'vue';

  const props = defineProps({
    bgIndex: {type: Number, default: 0},
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
     * @property {Number} bgIndex
     *
     * @type CreditCardInfo
     */
    creditCardInfo: {required: true}
  });
  const parsedDate = computed(() => {
    const _parsedDate = parseISODate(dateStore._ISODate);
    return {
      month: _parsedDate.month,
      year: _parsedDate.year
    };
  })

  const emit = defineEmits(['editEffectiveInvoice'])

  // METHODS
  function intToString(int) {
    return int < 10 ? `0${int}` : `${int}`;
  }
  function onEditEffectiveInvoice(reactiveEffectiveInvoice) {
    emit('editEffectiveInvoice', {...props.creditCardInfo.monthEffectiveInvoice})
  }
</script>

<template>
  <WaveCard :bg-colors="props.creditCardInfo.bgIndex">
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
        <h6 v-if="props.creditCardInfo.simulatedMonthInvoice !== null">
          R$ {{ formatIntToCurrency(props.creditCardInfo.simulatedMonthInvoice) }}
        </h6>
        <div v-else class="spinner-wrapper">
          <div class="spinner-border mx-auto" role="status"></div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div>
          <p>Fatura Efetiva:</p>
          <h6 v-if="props.creditCardInfo.monthEffectiveInvoice !== null" @click="onEditEffectiveInvoice(props.creditCardInfo.monthEffectiveInvoice)">
            R$ {{ formatIntToCurrency(props.creditCardInfo.monthEffectiveInvoice.value) }}
            <i class="bi bi-pencil-fill"></i>
          </h6>
          <div v-else class="spinner-wrapper">
            <div class="spinner-border mx-auto" role="status"></div>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card-info">
          <div>
            <p>Fech</p>
            <h6>{{ `${intToString(props.creditCardInfo.closeDay)}/${intToString(parsedDate.month + 1)}` }}</h6>
          </div>

          <div>
            <p>Venc</p>
            <h6>{{ `${intToString(props.creditCardInfo.dueDay)}/${intToString(parsedDate.month + 1)}` }}</h6>
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
