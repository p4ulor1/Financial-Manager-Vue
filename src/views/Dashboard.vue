<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import InfoCard from '@/components/InfoCard.vue';
  import CreditCardCarousel from '@/components/CreditCardCarousel.vue';
  import FloatBtn from '@/components/FloatBtn.vue';
  import SelectDateModal from '@/components/modals/SelectDateModal.vue';
  // import YearSummaryChart from "@/components/YearSummaryChart.vue";
  import MonthSummaryChart from "@/components/MonthSummaryChart.vue";
  import { formatIntToCurrency, formatCurrencyToInt } from '@/vueUtils/currencyUtils';
  import { parseISODate } from '@/vueUtils/dateUtils';
  import { dateStore } from '@/stores/dateStore';
  import MockDashboardRepository from '@/financialManager/repositories/MockDashboardRepository';
  import DashboardUseCases from '@/financialManager/useCases/DashboardUseCases';

  const repo = new MockDashboardRepository(null);
  const useCases = new DashboardUseCases(repo);
  const budgetID = 'budgetIDMock';
  const date = computed(() => dateStore._ISODate);
  // dom
  const selectDateModal = ref(null);
  const creditCardCarouselEl = ref(null);
  const simulatedSummaryChartEl = ref(null);
  const effectiveSummaryChartEl = ref(null);
  // variáveis de back end
  const yearIncomesValues = ref(null);
  const yearExpensesValues = ref(null);
  const yearCreditCardsInvoicesValues = ref(null);
  const yearContributionsValues = ref(null);
  // variaveis de front end dependentes do dominio
  const monthIncomeAmount = ref(null);
  const monthExpensesAmounts = ref({
    simulated: null,
    effective: null
  });
  const monthContributionAmount = ref(null);
  const monthResultAmount = ref({
    simulated: null,
    effective: null
  });

  // Methods
  async function bootstrap() {
    yearIncomesValues.value = await useCases.getIncomesValuesByYear(
      budgetID,
      date.value
    );
    yearExpensesValues.value = await useCases.getExpensesValuesByYear(
      budgetID,
      date.value
    );
    yearCreditCardsInvoicesValues.value = await useCases.getCreditCardsInvoicesValueByYear(
      budgetID,
      date.value
    );
    yearContributionsValues.value = await useCases.getContributionsValuesByYear(
      budgetID,
      date.value
    );

    setCreditCardsCarousel(yearCreditCardsInvoicesValues.value);
    setMonthIncomeAmount(yearIncomesValues.value);
    setMonthExpensesAmounts(yearExpensesValues.value, yearCreditCardsInvoicesValues.value);
    setMonthContributionAmount(yearContributionsValues.value);
    setMonthResultAmount();
    setMonthSummaryChart();
  }
  function setLoadingData() {
    monthIncomeAmount.value = null;
    monthExpensesAmounts.value = {simulated: null, effective: null};
    monthContributionAmount.value = null;
    monthResultAmount.value = {simulated: null, effective: null};
    simulatedSummaryChartEl.value.setChartData([]);
    effectiveSummaryChartEl.value.setChartData([]);
  }
  function setMonthIncomeAmount(_yearIncomesValues, month = null) {
    if (month === null)
      month = parseISODate(date.value).month;
    monthIncomeAmount.value = formatIntToCurrency(_yearIncomesValues[month - 1]);
  }
  function setMonthExpensesAmounts(_yearExpensesValues, _yearCreditCardsInvoicesValues, month = null) {
    if (month === null)
      month = parseISODate(date.value).month;
    // Expense
    let simulated = null;
    let effective = null;
    simulated = _yearExpensesValues[month - 1];
    effective = _yearExpensesValues[month - 1];
    // Invoice
    let simulatedInvoicesAmount = 0;
    let effectiveInvoicesAmount = 0;
    _yearCreditCardsInvoicesValues.forEach((creditCardInfo, i) => {
      simulatedInvoicesAmount += creditCardInfo.simulatedInvoicesValuesByYear[month - 1];
      effectiveInvoicesAmount += creditCardInfo.effectiveInvoicesValuesByYear[month - 1];
    });
    simulated += simulatedInvoicesAmount;
    effective += effectiveInvoicesAmount;
    // Return
    monthExpensesAmounts.value = {
      simulated: formatIntToCurrency(simulated),
      effective: formatIntToCurrency(effective)
    };
  }
  function setMonthContributionAmount(_yearContributionsValues, month = null) {
    if (month === null)
      month = parseISODate(date.value).month;

    monthContributionAmount.value = formatIntToCurrency(_yearContributionsValues[month - 1]);
  }
  function setMonthResultAmount() {
    const incomeAmount = monthIncomeAmount.value !== null ?
      formatCurrencyToInt(monthIncomeAmount.value) :
      0;
    const simulatedExpenseAmount = monthExpensesAmounts.value.simulated !== null ?
      formatCurrencyToInt(monthExpensesAmounts.value.simulated) :
      0;
    const effectiveExpenseAmount = monthExpensesAmounts.value.effective !== null ?
      formatCurrencyToInt(monthExpensesAmounts.value.effective) :
      0;
    const contributionAmount = monthContributionAmount.value !== null ?
      formatCurrencyToInt(monthContributionAmount.value) :
      0;

    monthResultAmount.value = {
      simulated: formatIntToCurrency(incomeAmount - simulatedExpenseAmount - contributionAmount),
      effective: formatIntToCurrency(incomeAmount - effectiveExpenseAmount - contributionAmount)
    };
  }
  function setMonthSummaryChart() {
    simulatedSummaryChartEl.value.setChartData([
      formatCurrencyToInt(monthIncomeAmount.value),
      formatCurrencyToInt(monthExpensesAmounts.value.simulated),
      formatCurrencyToInt(monthContributionAmount.value),
      formatCurrencyToInt(monthResultAmount.value.simulated)
    ]);
    effectiveSummaryChartEl.value.setChartData([
      formatCurrencyToInt(monthIncomeAmount.value),
      formatCurrencyToInt(monthExpensesAmounts.value.effective),
      formatCurrencyToInt(monthContributionAmount.value),
      formatCurrencyToInt(monthResultAmount.value.effective)
    ]);
  }
  function setCreditCardsCarousel(_yearCreditCardsInvoicesValues, month = null) {
    if (month === null)
      month = parseISODate(date.value).month;

    const creditCardsCarouselInfos = _yearCreditCardsInvoicesValues
      .map(creditCardYearInfos => {
        return {
          id: creditCardYearInfos.creditCard.id,
          owner: creditCardYearInfos.creditCard.owner,
          operator: creditCardYearInfos.creditCard.operator,
          last4CardNumbers: creditCardYearInfos.creditCard.last4CardNumbers,
          closeDay: creditCardYearInfos.creditCard.closeDay,
          dueDay: creditCardYearInfos.creditCard.dueDay,
          simulatedMonthInvoice: creditCardYearInfos.simulatedInvoicesValuesByYear[month - 1],
          monthEffectiveInvoice: {value: creditCardYearInfos.effectiveInvoicesValuesByYear[month - 1]}
        };
    });

    creditCardCarouselEl.value.setCreditCardsInfos(creditCardsCarouselInfos);
  }

  watch(date, (newDate, oldDate) => {
    if (newDate.slice(0, 4) === oldDate.slice(0, 4)) {
      setCreditCardsCarousel(yearCreditCardsInvoicesValues.value, parseISODate(newDate).month);
      setMonthIncomeAmount(yearIncomesValues.value, parseISODate(newDate).month);
      setMonthExpensesAmounts(yearExpensesValues.value, yearCreditCardsInvoicesValues.value, parseISODate(newDate).month);
      setMonthContributionAmount(yearContributionsValues.value, parseISODate(newDate).month);
      setMonthResultAmount();
      setMonthSummaryChart();
    }
    else {
      setLoadingData();
      bootstrap();
    }
  });

  onMounted(() => {
    bootstrap();
  });
</script>

<template>
  <div class="container">
    <!-- MONTH SUMMARY SECTION -->
    <section>
      <InfoCard
        :category="['Entrada']"
        :sub-info="['Total de entrada no mês']"
        :icon-color="0"
        :info="[monthIncomeAmount]"
        icon="bi-cash"
      ></InfoCard>
      <InfoCard
        :category="['Despesas Simulada', 'Despesa Efetiva']"
        :sub-info="[
          'Despesa Simulada: Total de despesas incluindo despesas com cartões',
          'Despesa Efetiva: Total de despesas incluindo faturas definidas'
        ]"
        :icon-color="4"
        :info="[monthExpensesAmounts.simulated, monthExpensesAmounts.effective]"
        icon="bi-receipt-cutoff"
      ></InfoCard>
      <InfoCard
        :category="['Aporte']"
        :sub-info="['Total de aportes no mês']"
        :icon-color="3"
        :info="[monthContributionAmount]"
        icon="bi-piggy-bank-fill"
      ></InfoCard>
      <InfoCard
        :category="['Resultado Simulado', 'Resultado Efetivo']"
        :sub-info="[
          'Resultado Simulado: Usa despesa simulada para o calculo',
          'Resultado Efetivo: Usa despesa efetiva para o calculo',
        ]"
        :icon-color="2"
        :info="[monthResultAmount.simulated, monthResultAmount.effective]"
        icon="bi-wallet2"
      ></InfoCard>
    </section>

    <!-- CREDIT CARD SECTION -->
    <section>
      <CreditCardCarousel
        ref="creditCardCarouselEl"
      ></CreditCardCarousel>
    </section>

    <!-- CHARTS SECTION -->
    <section>
      <MonthSummaryChart
        ref="simulatedSummaryChartEl"
        title="Resultado Simulado"
      ></MonthSummaryChart>
      <MonthSummaryChart
        ref="effectiveSummaryChartEl"
        title="Resultado Efetivo"
      ></MonthSummaryChart>
      <!-- <YearSummaryChart
        ref="yearSummaryChartEl"
        :year="parseISODate(date).year"
      ></YearSummaryChart> -->
    </section>

    <!-- SET DATE BUTTON -->
    <FloatBtn
      @click="selectDateModal.show()"
    >
      <i class="bi bi-calendar3"></i>
    </FloatBtn>

    <!-- MODAL -->
    <SelectDateModal ref="selectDateModal"></SelectDateModal>
  </div>
</template>

<style lang="scss"></style>
