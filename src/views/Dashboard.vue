<script setup>
  import InfoCard from '@/components/InfoCard.vue';
  import CreditCardCarousel from '@/components/CreditCardCarousel.vue';
  import FloatBtn from '@/components/FloatBtn.vue';
  import SelectDateModal from '@/components/SelectDateModal.vue';
  import YearSummaryChart from "@/components/YearSummaryChart.vue";
  import MonthSummaryChart from "@/components/MonthSummaryChart.vue";
  import { ref, shallowRef, computed } from 'vue';
  import { float2string } from '@/vueUtils/float2string';

  // dom
  const selectDateModal = ref(null);
  // variaveis de front end dependentes do dominio
  const monthSummary = {
    income: 0,
    expense: 0,
    contribution: 0,
    result: 0
  };
  const creditCards = [
    {operator: 'Operadora 1', owner: 'Pessoa 1', last4CardNumbers: '1234', closeDate: '05/06', dueDate: '10/06', invoice: '123,45'},
    {operator: 'Operadora 2', owner: 'Pessoa 2', last4CardNumbers: '1234', closeDate: '05/06', dueDate: '10/06', invoice: '123,45'},
    {operator: 'Operadora 3', owner: 'Pessoa 3', last4CardNumbers: '1234', closeDate: '05/06', dueDate: '10/06', invoice: '123,45'},
  ];
  // year summary chart dependency
  const yearSummaryChart = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // incomes per month
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // expense per month
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // contribution per month
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // result per month
  ];
</script>

<template>
  <div class="container">
    <!-- MONTH SUMMARY SECTION -->
    <section>
      <InfoCard
        category="Entrada"
        sub-info="Total de entrada no mês"
        :icon-color="0"
        :info="monthSummary ? float2string(monthSummary.income) : null"
      ></InfoCard>
      <InfoCard
        category="Despesas"
        sub-info="Total de despesas no mês"
        :icon-color="4"
        :info="monthSummary ? float2string(monthSummary.expense) : null"
      ></InfoCard>
      <InfoCard
        category="Aporte"
        sub-info="Total de aportes no mês"
        :icon-color="3"
        :info="monthSummary ? float2string(monthSummary.contribution) : null"
      ></InfoCard>
      <InfoCard
        category="Resultado"
        sub-info="Resultado total no mês"
        :icon-color="2"
        :info="monthSummary ? float2string(monthSummary.result) : null"
      ></InfoCard>
    </section>

    <!-- CHARTS SECTION -->
    <section>
      <MonthSummaryChart
        :data="monthSummary
          ? [monthSummary.income, monthSummary.expense, monthSummary.contribution, monthSummary.result]
          : null"
      ></MonthSummaryChart>
      <YearSummaryChart
        :data="yearSummaryChart"
        :year="'*year here*'"
      ></YearSummaryChart>
    </section>

    <!-- CREDIT CARD SECTION -->
    <section>
      <CreditCardCarousel
        :credit-cards-info="creditCards"
      ></CreditCardCarousel>
    </section>

    <!-- SET DATE BUTTON -->
    <FloatBtn
      @click="selectDateModal.show()"
    >
      <i class="bi bi-calendar3"></i>
    </FloatBtn>

    <!-- MODAL -->
    <SelectDateModal ref="selectDateModal"
    ></SelectDateModal>
  </div>
</template>

<style lang="scss"></style>
