<script setup>
  import InfoCard from '@/components/InfoCard.vue';
  import TrasactionYearSummaryChart from '@/components/TrasactionYearSummaryChart.vue';
  import Statistic from '@/components/Statistic.vue';
  import Table from '@/components/Table.vue';
  import FloatBtn from '@/components/FloatBtn.vue';
  import CreateExpense from '@/components/modals/CreateExpense.vue';
  import { colors } from '@/assets/js/utils/colors';
  import { ref, computed, onMounted, watch } from 'vue';
  import { formatISOToBrDate, parseISODate, formatBrDateToISO } from '@/vueUtils/dateUtils';
  import { formatIntToCurrency, formatCurrencyToInt } from '@/vueUtils/currencyUtils';
  // Dominio
  import { dateStore } from '@/stores/dateStore';
  import MockExpenseRepository from '@/financialManager/repositories/MockExpenseRepository';
  import getExpenseValuesByYear from '@/financialManager/useCases/expense/getExpenseValuesByYear';
  import getExpensesByMonth from '@/financialManager/useCases/expense/getExpensesByMonth';
  import getLast12MonthsValues from '@/financialManager/useCases/expense/getLast12MonthsValues';
  import addExpense from '@/financialManager/useCases/expense/addExpense';
  import removeExpense from '@/financialManager/useCases/expense/removeExpense';

  const repo = new MockExpenseRepository(null);
  const date = computed(() => dateStore._ISODate);
  // variaveis de back end
  const expenseYearValeus = ref(null);
  const monthExpenses = ref(null);
  const last12MonthsValues = ref(null);
  // DOM
  const chartEl = ref(null);
  const createExpenseEl = ref(null);
  // variaveis de front end dependentes do dominio
  const tableData = computed(() => {
    if (monthExpenses.value === null) return null;

    return monthExpenses.value.map(expense => ({
      id: expense.id,
      data: [
        expense.description,
        expense.expenseType,
        formatISOToBrDate(expense.date),
        formatIntToCurrency(expense.value),
      ]
    }));
  });
  const statisticData = computed(() => {
    if (last12MonthsValues.value === null) return [];

    const last12MonthsAverage = last12MonthsValues.value.reduce((accumulator, currentValue, currentIndex) => {
      if (currentIndex === 11) return (accumulator + currentValue) / 12;

      return accumulator + currentValue;
    }, 0);
    const yearAmount = expenseYearValeus.value.reduce((accumulator, currentValue, currentIndex) => {
      return accumulator + currentValue;
    }, 0);
    const yearAverage = yearAmount/12;

    return [yearAverage / 100, last12MonthsAverage / 100, yearAmount / 100];
  });
  const monthExpense = computed(() => {
    if (expenseYearValeus.value === null) return null;

    const month = parseISODate(date.value).month;

    return formatIntToCurrency(expenseYearValeus.value[month - 1]);
  });

  // Watch expenseYearValeus to update the chart
  watch(expenseYearValeus, (newExpenseValues) => {
    chartEl.value.setChartData(newExpenseValues);
  }, { deep: true });
  // Watch date
  watch(date, async (newDate, oldDate) => {
    const expenses = await getExpensesByMonth(repo, date.value.substring(0, 8));
    monthExpenses.value = expenses;

    const parsedNewDate = parseISODate(newDate);
    const parsedOldDate = parseISODate(oldDate);

    if (parsedNewDate.year !== parsedOldDate.year) {
      const expenseValues = await getExpenseValuesByYear(repo, parseISODate(date.value).year);
      expenseYearValeus.value = expenseValues;
    };
  });

  // Methods
  async function onCreateExpense(expense) {
    const normalizedExpense = {...expense};
    normalizedExpense.date = formatBrDateToISO(normalizedExpense.date);
    normalizedExpense.value = formatCurrencyToInt(normalizedExpense.value);

    const createdExpense = await addExpense(repo, normalizedExpense);
    const month = parseISODate(date.value).month;

    monthExpenses.value.push(createdExpense);
    expenseYearValeus.value[month - 1] += createdExpense.value;
    // In case of the expense is in last 12 months
    getLast12MonthsValues(repo, date.value.substring(0, 8)).then(expenseValues => {
      last12MonthsValues.value = expenseValues;
    });
  }
  async function onDeleteExpense(expenseTableData) {
    const expenseToDelete = {
      id: expenseTableData.id,
      description: expenseTableData.data[0],
      expenseType: expenseTableData.data[1],
      date: formatBrDateToISO(expenseTableData.data[2]),
      value: formatCurrencyToInt(expenseTableData.data[3])
    };

    const deletedExpense = await removeExpense(repo, expenseToDelete);
    const month = parseISODate(date.value).month;

    monthExpenses.value = monthExpenses.value.filter(tb => tb.id !== deletedExpense.id);
    expenseYearValeus.value[month - 1] -= deletedExpense.value;
    // In case of the expense is in last 12 months
    getLast12MonthsValues(repo, date.value.substring(0, 8)).then(expenseValues => {
      last12MonthsValues.value = expenseValues;
    });
  }

  onMounted(() => {
    getExpenseValuesByYear(repo, parseISODate(date.value).year).then(expenseValues => {
      expenseYearValeus.value = expenseValues;
    });
    getExpensesByMonth(repo, date.value.substring(0, 8)).then(expenses => {
      monthExpenses.value = expenses;
    });
    getLast12MonthsValues(repo, date.value.substring(0, 8)).then(expenseValues => {
      last12MonthsValues.value = expenseValues;
    });
  });
</script>

<template>
  <div class="container">
    <section>
      <InfoCard
        :category="['Despesa']"
        :sub-info="['Total de despesas no mês']"
        :icon-color="4"
        :info="[monthExpense]"
      ></InfoCard>
    </section>

    <section>
      <TrasactionYearSummaryChart
        ref="chartEl"
        :year="parseISODate(date).year"
        category="Histórico de Despesas no Ano"
        label="Entradas"
        :chart-bg-color="colors.danger"
      >
      </TrasactionYearSummaryChart>
    </section>

    <section>
      <Table
        :title="'Despesas'"
        :category="'Despesas registradas'"
        :headers="['Descrição', 'Categoria', 'Data', 'Valor']"
        :table-data="tableData"
        @delete-row="onDeleteExpense"
      ></Table>
    </section>

    <section>
      <Statistic
        :statistics-data="statisticData"
      ></Statistic>
    </section>

    <FloatBtn
      @click="createExpenseEl.show()"
    >
      <i class="bi bi-plus-lg"></i>
    </FloatBtn>

    <CreateExpense
      ref="createExpenseEl"
      @create-expense-submit="onCreateExpense"
    ></CreateExpense>
  </div>
</template>

<style lang="scss" scoped></style>
