<script setup>
  import InfoCard from '@/components/InfoCard.vue';
  import TrasactionYearSummaryChart from '@/components/TrasactionYearSummaryChart.vue';
  import Statistic from '@/components/Statistic.vue';
  import Table from '@/components/Table.vue';
  import CreditCardCarousel from '@/components/CreditCardCarousel.vue';
  import { colors } from '@/assets/js/utils/colors';
  import { computed, ref } from 'vue';

  // variavel responsavel por rastrear o cartao ativo
  const creditCardActiveIndex = ref(0);
  // end
  // variaveis de front end dependentes do dominio
  const carouselData = [
    {
      id: 1,
      last4CardNumbers: '1234',
      owner: 'Owner 1',
      operator: 'Operator 1',
      invoice: 123.45,
      closeDate: '01/01',
      dueDate: '01/01',
      yearInvoicesValue: [123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45]
    },
    {
      id: 2,
      last4CardNumbers: '1234',
      owner: 'Owner 2',
      operator: 'Operator 2',
      invoice: 123.45,
      closeDate: '01/01',
      dueDate: '01/01',
      yearInvoicesValue: [234.56, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45]
    },
    {
      id: 3,
      last4CardNumbers: '1234',
      owner: 'Owner 3',
      operator: 'Operator 3',
      invoice: 123.45,
      closeDate: '01/01',
      dueDate: '01/01',
      yearInvoicesValue: [345.67, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45, 123.45]
    }
  ]
  const chartData = computed(() => {
    if (carouselData) {
      return carouselData[creditCardActiveIndex.value].yearInvoicesValue;
    }

    else return [];
  });
  // end

  /**
   * Responsável em atualizar o cartão ativo
   */
  function setCurrentCreditCard(creditCard) {
    creditCardActiveIndex.value = carouselData.findIndex(_creditCard => {
      return _creditCard.id === creditCard.id;
    });
  }
</script>

<template>
  <div class="container">
    <section>
      <CreditCardCarousel
        :credit-cards-info="carouselData"
        @carousel-slide="setCurrentCreditCard"
      ></CreditCardCarousel>
    </section>

    <section>
      <TrasactionYearSummaryChart
        category="Histórico de faturas no ano"
        :title="'*year here*'"
        :chart-bg-color="colors.purple"
        :data="chartData"
        :step-size="100"
      >
      </TrasactionYearSummaryChart>
    </section>

    <!-- <section>
      <Statistic
        :statistics-data="statistics"
      ></Statistic>
    </section> -->
  </div>
</template>
