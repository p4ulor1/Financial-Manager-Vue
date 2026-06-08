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
  // Domain dependecies
  import { dateStore } from '@/stores/dateStore';
  import MockIncomeRepository from '@/financialManager/repositories/MockIncomeRepository.js';
  import getIncomesValueByYear from '@/financialManager/useCases/income/getIncomesValueByYear.js';
  import getIncomesByMonth from '@/financialManager/useCases/income/getIncomesByMonth.js';
  import getLast12MonthsValues from '@/financialManager/useCases/income/getLast12MonthsValues.js';
  import addIncome from '@/financialManager/useCases/income/addIncome';
  import removeIncome from '@/financialManager/useCases/income/removeIncome';

  const repo = new MockIncomeRepository();
  const date = computed(() => dateStore._ISODate);
  // variaveis de Dominio
  const yearIncomesValue = ref(null);
  const monthIncomes = ref(null);
  const last12MonthsValues = ref(null);
  // dom
  const modalEl = ref(null);
  const chartEl = ref(null);
  // variaveis de front end dependentes do dominio
  const tableData = computed(() => {
    if (monthIncomes.value === null)
    return null;

    return monthIncomes.value.map(income => ({
      id: income.id,
      data: [
        income.description,
        income.incomeType,
        formatISOToBrDate(income.date),
        formatIntToCurrency(income.value)
      ]
    }));
  });
  const monthIncome = computed(() => {
    if (yearIncomesValue.value === null) return null;

    const month = parseISODate(date.value).month;

    return formatIntToCurrency(yearIncomesValue.value[month - 1]);
  });
  const statisticsData = computed(() => {
    if (last12MonthsValues.value === null) return [];

    const last12MonthsAverage = last12MonthsValues.value.reduce((accumulator, currentValue, currentIndex) => {
      if (currentIndex === 11) return (accumulator + currentValue) / 12;

      return accumulator + currentValue;
    }, 0);
    const yearAmount = yearIncomesValue.value.reduce((accumulator, currentValue, currentIndex) => {
      return accumulator + currentValue;
    }, 0);
    const yearAverage = yearAmount/12;

    return [yearAverage / 100, last12MonthsAverage / 100, yearAmount / 100];
  });

  watch(yearIncomesValue, (newIncomesValue) => {
    chartEl.value.setChartData(newIncomesValue);
  }, { deep: true });
  // watch date
  watch(date, async (newDate, oldDate) => {
    const incomes = await getIncomesByMonth(repo, date.value.substring(0,7));
    monthIncomes.value = incomes;

    const parsedNewDate = parseISODate(newDate);
    const parsedOldDate = parseISODate(oldDate);

    if (parsedNewDate.year !== parsedOldDate.year) {
      const incomesValue = await getIncomesValueByYear(repo, parseISODate(date.value).year);
      yearIncomesValue.value = incomesValue;
    };
  });

  // METHODS
  async function onCreateIncome(income) {
    let normalizedIncome = {...income};
    normalizedIncome.date = formatBrDateToISO(income.date);
    normalizedIncome.value = formatCurrencyToInt(income.value);

    const addedIncome = await addIncome(repo, normalizedIncome);
    const month = parseISODate(date.value).month;

    monthIncomes.value.push(addedIncome);
    yearIncomesValue.value[month - 1] += addedIncome.value;

    const parsedMonth = parseISODate(addedIncome.date).month - 1;
    const currentMonthIncomeValue = yearIncomesValue.value[parsedMonth];

    last12MonthsValues.value = await getLast12MonthsValues(repo, date.value);
  };
  async function onRemoveIncome(incomeTableData) {
    const incomeToRemove = {
      id: incomeTableData.id,
      description: incomeTableData.data[0],
      incomeType: incomeTableData.data[1],
      date: formatBrDateToISO(incomeTableData.data[2]),
      value: formatCurrencyToInt(incomeTableData.data[3])
    };

    const removedIncome = await removeIncome(repo, incomeToRemove);
    const month = parseISODate(date.value).month;

    monthIncomes.value = monthIncomes.value.filter(tb => tb.id !== removedIncome.id);
    yearIncomesValue.value[month - 1] -= removedIncome.value;

    last12MonthsValues.value = await getLast12MonthsValues(repo, date.value);
  }

  onMounted(() => {
    getIncomesValueByYear(repo, parseISODate(date.value).year).then(incomesValue => {
        yearIncomesValue.value = incomesValue;
    });
    getIncomesByMonth(repo, date.value.substring(0,7)).then(incomes => {
      monthIncomes.value = incomes;
    });
    getLast12MonthsValues(repo, dateStore.toCurrentISOString()).then((incomes) => {
      last12MonthsValues.value = incomes;
    });
  });
</script>

<template>
  <div class="container">
    <!-- Month Summary -->
    <section>
      <InfoCard
        :icon-color="0"
        :info="monthIncome"
        category="Entrada"
        sub-info="Total de entrada no mês"
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
        :tableData="tableData"
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
