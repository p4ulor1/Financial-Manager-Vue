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
  import statisticsBuilder from "@/vueUtils/statisticsBuilder";
  // Dominio
  import { dateStore } from '@/stores/dateStore';
  import MockExpenseRepository from '@/financialManager/repositories/MockExpenseRepository';
  import ExpenseUseCases from "@/financialManager/useCases/ExpenseUseCases";

  const repo = new MockExpenseRepository(null);
  const useCases = new ExpenseUseCases(repo);
  const budgetID = 'budgetIDMock';
  const date = computed(() => dateStore._ISODate);
  // variaveis de back end
  const yearExpensesValues = ref(null);
  const monthExpenses = ref(null);
  // DOM
  const chartEl = ref(null);
  const createExpenseEl = ref(null);
  // variaveis de front end dependentes do dominio
  const monthExpenseAmount = ref(null);
  const transactionTable = ref(null);
  const statisticsData = ref(null);

  // Watch date
  watch(date, async (newDate, oldDate) => {
    if (parseISODate(newDate).year === parseISODate(oldDate).year) {
      setMonthExpense(yearExpensesValues.value, parseISODate(newDate).month);
    }
    else {
      const expensesValuesByYear = await useCases.getExpensesValuesByYear(
        budgetID,
        parseISODate(date.value).year.toString()
      );

      yearExpensesValues.value = expensesValuesByYear;
      setMonthExpense(expensesValuesByYear, parseISODate(newDate).month);
      setChart(expensesValuesByYear);
      setStatisticsData(expensesValuesByYear);
    }

    const expensesByMonth = await useCases.getExpensesByMonth(
      budgetID,
      newDate.slice(0, 7)
    );

    monthExpenses.value = expensesByMonth;
    setExpensesTable(expensesByMonth);
  });

  // Methods
  function setChart(expensesValuesByYear) {
    chartEl.value.setChartData(expensesValuesByYear);
  }
  function setMonthExpense(expensesValuesByYear, month = null) {
    if (month === null)
      month = parseISODate(date.value).month;

    monthExpenseAmount.value = formatIntToCurrency(expensesValuesByYear[month - 1]);
  }
  function setExpensesTable(expensesByMonth) {
    transactionTable.value = expensesByMonth
      .map(monthExpense => {
        return {
          id: monthExpense.id,
          data: [
            monthExpense.description,
            monthExpense.expenseType,
            formatISOToBrDate(monthExpense.date),
            formatIntToCurrency(monthExpense.value)
          ]
        };
      });
  }
  function setStatisticsData(expensesValuesByYear) {
    statisticsData.value = statisticsBuilder(expensesValuesByYear);
  }
  async function onCreateExpense(expense) {
    const createdExpense = await useCases.createExpense(budgetID, expense);
    const month = parseISODate(createdExpense.date).month;

    if (createdExpense.date.slice(0, 7) === date.value.slice(0, 7))
      monthExpenses.value.push(createdExpense);
    if (createdExpense.date.slice(0, 4) === date.value.slice(0, 4))
      yearExpensesValues.value[month - 1] += createdExpense.value;

    setMonthExpense(yearExpensesValues.value);
    setChart(yearExpensesValues.value);
    setExpensesTable(monthExpenses.value);
    setStatisticsData(yearExpensesValues.value);
  }
  async function onDeleteExpense(expenseTableData) {
    const expenseToDelete = {
      id: expenseTableData.id,
      description: expenseTableData.data[0],
      expenseType: expenseTableData.data[1],
      date: formatBrDateToISO(expenseTableData.data[2]),
      value: formatCurrencyToInt(expenseTableData.data[3])
    };
    const expenseID = expenseTableData.id
    const expenseDate = formatBrDateToISO(expenseTableData.data[2])

    const deletedExpense = await useCases.deleteExpense(budgetID, expenseToDelete);
    const month = parseISODate(deletedExpense.date).month;

    if (deletedExpense.date.slice(0, 7) === date.value.slice(0, 7))
      monthExpenses.value = monthExpenses.value.filter(tb => tb.id !== deletedExpense.id);
    if (deletedExpense.date.slice(0, 4) === date.value.slice(0, 4))
      yearExpensesValues.value[month - 1] -= expenseToDelete.value;

    setMonthExpense(yearExpensesValues.value);
    setChart(yearExpensesValues.value);
    setExpensesTable(monthExpenses.value);
    setStatisticsData(yearExpensesValues.value);
  }

  onMounted(async () => {
    const expensesValuesByYear = await useCases.getExpensesValuesByYear(
      budgetID,
      parseISODate(date.value).year.toString()
    );
    const expensesByMonth = await useCases.getExpensesByMonth(
      budgetID,
      date.value.slice(0, 7)
    );

    yearExpensesValues.value = expensesValuesByYear;
    monthExpenses.value = expensesByMonth;
    setMonthExpense(expensesValuesByYear);
    setChart(expensesValuesByYear);
    setExpensesTable(expensesByMonth);
    setStatisticsData(expensesValuesByYear);
  });
</script>

<template>
  <div class="container">
    <section>
      <InfoCard
        :category="['Despesa']"
        :sub-info="['Total de despesas no mês']"
        :icon-color="4"
        :info="[monthExpenseAmount]"
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
        :transaction-table="transactionTable"
        @delete-row="onDeleteExpense"
      ></Table>
    </section>

    <section>
      <Statistic
        :statistics-data="statisticsData"
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
