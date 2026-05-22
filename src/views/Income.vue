<script setup>
  import InfoCard  from '@/components/InfoCard.vue';
  import Statistic from '@/components/Statistic.vue';
  import FloatBtn  from '@/components/FloatBtn.vue';
  import Table     from '@/components/Table.vue';
  import TrasactionYearSummaryChart from '@/components/TrasactionYearSummaryChart.vue';
  import CreateIncome from '@/components/modals/CreateIncome.vue';
  import { computed, ref, watch, onMounted } from 'vue';
  import { colors } from '@/assets/js/utils/colors';
  import { float2string } from '@/vueUtils/float2string';
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

  const date = computed(() => {
    return dateStore._ISODate;
  });
  // dom
  const modalEl = ref(null);
  const chartEl = ref(null);
  // variaveis de Dominio
  const repo = new MockIncomeRepository();
  const yearIncomesValue = ref(null);
  const last12MonthsValues = ref(null);
  const yearIncomesAmount = computed(() => {
    if (yearIncomesValue.value === null)
      return null;

    return yearIncomesValue.value.reduce((acc, cur) => acc + cur, 0) / 100;
  });
  const last12MonthsAverage = computed(() => {
    if (last12MonthsValues.value === null)
      return null;

    const amount = last12MonthsValues.value.reduce((acc, cur) => acc + cur, 0);
    return (amount / 12) / 100;
  });
  const yearIncomesAverage = computed(() => {
    if (yearIncomesValue.value === null)
      return null;

    const amount = yearIncomesValue.value.reduce((acc, cur) => acc + cur, 0);
    return (amount / 12) / 100;
  });
  const monthIncomes = ref(null);
  // variaveis de front end dependentes do dominio
  const monthIncome = computed(() => {
    if (yearIncomesValue.value === null)
      return null;

    return formatIntToCurrency(yearIncomesValue.value[parseISODate(date.value).month - 1]);
  });
  const statisticsData = computed(() => {
    return [yearIncomesAverage.value, last12MonthsAverage.value, yearIncomesAmount.value];
  }); // ToDo: Substituir pela estatistica real
  /*
   * @typedef {Object} IncomeTable
   * @property {string} id
   * @property {Array} data
   *
   * @type {Array<IncomeTable>|null}
   */
  const tableData = computed(() => {
    if (monthIncomes.value === null)
      return null;

    return tableDataBuilder(monthIncomes.value);
  })

  // watch date
  watch(date, () => {
    getIncomesValueByYear(repo, parseISODate(date.value).year).then(
      (incomesValue) => {
        yearIncomesValue.value = incomesValue;
        chartEl.value.setChartData(incomesValue.map(value => value / 100));
      }
    );
    // Update monthIncomes
    getIncomesByMonth(repo, date.value.substring(0,7)).then(incomes => {
      monthIncomes.value = incomes;
    });
  });

  /*
   * @typedef {Object} createIncome
   * @property {string} id
   * @property {string} description
   * @property {string} incomeType
   * @property {string} date - ISO Format
   * @property {number} value - Integer
   *
   * @typedef {Object} tableData
   * @property {String} description
   * @property {Array} data
   *
   * @param {Array<>} incomesOfMonth
   * @returns {tableData}
   */
  function tableDataBuilder(incomesOfMonth) {
    return incomesOfMonth.map((income, index) => ({
      id: income.id,
      data: [
        income.description,
        income.incomeType,
        formatISOToBrDate(income.date),
        formatIntToCurrency(income.value)
      ]
    }));
  }
  /*
   * @typedef {Object} createIncome
   * @property {string} description
   * @property {string} incomeType
   * @property {string} date - Br Format
   * @property {string} value - Currency Format
   *
   * @param {create_Income} income
   */
  async function onCreateIncome(income) {
    let normalizedIncome = {...income};

    normalizedIncome.date = formatBrDateToISO(income.date);
    normalizedIncome.value = formatCurrencyToInt(income.value);

    const addedIncome = await addIncome(repo, normalizedIncome);

    const parsedMonth = parseISODate(addedIncome.date).month - 1;
    const currentMonthIncomeValue = yearIncomesValue.value[parsedMonth];

    yearIncomesValue.value[parsedMonth] = currentMonthIncomeValue + addedIncome.value;
    // Update chart
    chartEl.value.updateChartData(yearIncomesValue.value.map(value => value / 100));
    // Update last12MonthsValues
    last12MonthsValues.value = await getLast12MonthsValues(repo, dateStore.toCurrentISOString());
    monthIncomes.value.push(addedIncome);
  };
  /*
   * @typedef {Object} incomeToRemove
   * @property {String} description
   * @property {Array} Data
   *
   * @param {incomeToRemove} income
   */
  async function onRemoveIncome(incomeToRemove) {
    const removedIncome = await removeIncome(repo, {
      id: incomeToRemove.id,
      description: incomeToRemove.data[0],
      incomeType: incomeToRemove.data[1],
      date: formatBrDateToISO(incomeToRemove.data[2]),
      value: formatCurrencyToInt(incomeToRemove.data[3])
    });

    const parsedMonth = parseISODate(removedIncome.date).month - 1;
    const currentMonthIncomeValue = yearIncomesValue.value[parsedMonth];

    yearIncomesValue.value[parsedMonth] = currentMonthIncomeValue - removedIncome.value;
    // Update chart
    chartEl.value.updateChartData(yearIncomesValue.value.map(value => value / 100));
    // Update last12MonthsValues
    last12MonthsValues.value = await getLast12MonthsValues(repo, dateStore.toCurrentISOString());
    monthIncomes.value = monthIncomes.value.filter(tb => tb.id !== removedIncome.id);
  }

  onMounted(() => {
    getIncomesValueByYear(repo, parseISODate(date.value).year).then(
      (incomesValue) => {
        yearIncomesValue.value = incomesValue;
        chartEl.value.setChartData(incomesValue.map(value => value / 100));
      }
    );
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
        category="Historico de Entradas no ano"
        :title="parseISODate(date).year.toString()"
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
