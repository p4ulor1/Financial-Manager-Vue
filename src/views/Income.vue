<script setup>
  import InfoCard  from '@/components/InfoCard.vue';
  import Statistic from '@/components/Statistic.vue';
  import FloatBtn  from '@/components/FloatBtn.vue';
  import Table     from '@/components/Table.vue';
  import TrasactionYearSummaryChart from '@/components/TrasactionYearSummaryChart.vue';
  import CreateIncome from '@/components/modals/CreateIncome.vue';
  import { computed, ref, watch, onMounted } from 'vue';
  import { colors } from '@/assets/js/utils/colors';
  import { formatBrDateToISO, parseISODate, parseBrDate, formatISOToBrDate } from '@/vueUtils/dateUtils';
  import { formatIntToCurrency, formatCurrencyToInt } from '@/vueUtils/currencyUtils';
  import statisticsBuilder from "@/vueUtils/statisticsBuilder";
  // Domain dependecies
  import { dateStore } from '@/stores/dateStore';
  import MockIncomeRepository from '@/financialManager/repositories/MockIncomeRepository';
  import IncomeUseCases from '@/financialManager/useCases/IncomeUseCases';

  const repo = new MockIncomeRepository();
  const useCases = new IncomeUseCases(repo);
  const date = computed(() => dateStore._ISODate);
  const budgetID = 'budgetIDMock';
  // variaveis de Dominio
  const yearIncomesValues = ref(null);
  const monthIncomes = ref(null);
  // dom
  const modalEl = ref(null);
  const chartEl = ref(null);
  // variaveis de front end dependentes do dominio
  const transactionTable = ref(null);
  const monthIncomeAmount = ref(null);
  const statisticsData = ref(null);

  // watch date
  watch(date, async (newDate, oldDate) => {
    if (parseISODate(newDate).year === parseISODate(oldDate).year) {
      setMonthIncome(yearIncomesValues.value, parseISODate(newDate).month);
    }
    else {
      const incomesValuesByYear = await useCases.getIncomesValuesByYear(
        budgetID,
        parseISODate(date.value).year.toString()
      );

      yearIncomesValues.value = incomesValuesByYear;
      setMonthIncome(incomesValuesByYear, parseISODate(newDate).month);
      setChart(incomesValuesByYear);
      setStatisticsData(incomesValuesByYear);
    }

    const incomesByMonth = await useCases.getIncomesByMonth(
      budgetID,
      newDate.slice(0, 7)
    );

    monthIncomes.value = incomesByMonth;
    setIncomesTable(incomesByMonth);
  });

  // METHODS
  function setChart(incomesValuesByYear) {
    chartEl.value.setChartData(incomesValuesByYear);
  }
  function setMonthIncome(incomesValuesByYear, month = null) {
    if (month === null)
      month = parseISODate(date.value).month;

    monthIncomeAmount.value = formatIntToCurrency(incomesValuesByYear[month - 1]);
  }
  function setIncomesTable(incomesByMonth) {
    transactionTable.value = incomesByMonth
      .map(monthIncome => {
        return {
          id: monthIncome.id,
          data: [
            monthIncome.description,
            monthIncome.incomeType,
            formatISOToBrDate(monthIncome.date),
            formatIntToCurrency(monthIncome.value)
          ]
        };
      });
  }
  function setStatisticsData(incomesValuesByYear) {
    statisticsData.value = statisticsBuilder(incomesValuesByYear);
  }
  async function onCreateIncome(income) {
    const addedIncome = await useCases.createIncome(budgetID, income);
    const month = parseISODate(addedIncome.date).month;

    if (addedIncome.date.slice(0, 7) === date.value.slice(0, 7))
      monthIncomes.value.push(addedIncome);
    if (addedIncome.date.slice(0, 4) === date.value.slice(0, 4))
      yearIncomesValues.value[month - 1] += addedIncome.value;

    setChart(yearIncomesValues.value);
    setMonthIncome(yearIncomesValues.value);
    setIncomesTable(monthIncomes.value);
    setStatisticsData(yearIncomesValues.value);
  };
  async function onRemoveIncome(incomeTransactionTable) {
    const incomeToRemove = {
      id: incomeTransactionTable.id,
      description: incomeTransactionTable.data[0],
      incomeType: incomeTransactionTable.data[1],
      date: formatBrDateToISO(incomeTransactionTable.data[2]),
      value: formatCurrencyToInt(incomeTransactionTable.data[3]),
    };
    const removedIncome = await useCases.deleteIncome(budgetID, incomeToRemove);
    const month = parseISODate(removedIncome.date).month;

    if (removedIncome.date.slice(0, 7) === date.value.slice(0, 7))
      monthIncomes.value = monthIncomes.value.filter(tb => tb.id !== removedIncome.id);
    if (removedIncome.date.slice(0, 4) === date.value.slice(0, 4))
      yearIncomesValues.value[month - 1] -= removedIncome.value;

    setChart(yearIncomesValues.value);
    setMonthIncome(yearIncomesValues.value);
    setIncomesTable(monthIncomes.value);
    setStatisticsData(yearIncomesValues.value);
  }

  onMounted(async () => {
    const incomesValuesByYear = await useCases.getIncomesValuesByYear(
      budgetID,
      parseISODate(date.value).year.toString()
    );
    const incomesByMonth = await useCases.getIncomesByMonth(
      budgetID,
      date.value.slice(0, 7)
    );

    yearIncomesValues.value = incomesValuesByYear;
    monthIncomes.value = incomesByMonth;
    setMonthIncome(incomesValuesByYear);
    setChart(incomesValuesByYear);
    setIncomesTable(incomesByMonth);
    setStatisticsData(incomesValuesByYear);
  });
</script>

<template>
  <div class="container">
    <!-- Month Summary -->
    <section>
      <InfoCard
        :icon-color="0"
        :info="[monthIncomeAmount]"
        :category="['Entrada']"
        :sub-info="['Total de entrada no mês']"
      ></InfoCard>
    </section>

    <!-- Historic chart -->
    <section>
      <TrasactionYearSummaryChart
        ref="chartEl"
        :year="parseISODate(date).year.toString()"
        category="Historico de Entradas no ano"
        label="Entradas"
        :chart-bg-color="colors.success"
      ></TrasactionYearSummaryChart>
    </section>

    <!-- Incomes Details -->
    <section>
      <Table
        title="Entradas"
        category="Tabela de entradas no mês"
        :headers="['Descrição', 'Tipo de Entrada', 'Data', 'Valor']"
        :transactionTable="transactionTable"
        @delete-row="onRemoveIncome"
      ></Table>
    </section>

    <!-- Statistics -->
    <section>
      <Statistic
        :statistics-data="statisticsData"
      ></Statistic>
    </section>

    <FloatBtn
      @click="modalEl.show()"
    >
      <i class="bi bi-plus-lg"></i>
    </FloatBtn>

    <CreateIncome
      ref="modalEl"
      @create-income-submit="onCreateIncome"
    ></CreateIncome>
  </div>
</template>

<style lang="scss" scoped></style>
