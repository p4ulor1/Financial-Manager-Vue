transactionTable<script setup>
  import InfoCard from '@/components/InfoCard.vue';
  import CreditCardYearSummaryChart from '@/components/CreditCardYearSummaryChart.vue';
  import Statistic from '@/components/Statistic.vue';
  import Table from '@/components/Table.vue';
  import CreditCardCarousel from '@/components/CreditCardCarousel.vue';
  import FloatBtn from '@/components/FloatBtn.vue';
  import CreateExpense from '@/components/modals/CreateExpense.vue';
  import CreateCreditCard from '@/components/modals/CreateCreditCard.vue';
  import EditEffectiveInvoice from '@/components/modals/EditEffectiveInvoice.vue';
  import { colors } from '@/assets/js/utils/colors';
  import { computed, ref, watch, onMounted } from 'vue';
  import statisticsBuilder from '@/vueUtils/statisticsBuilder';
  import { parseISODate, formatISOToBrDate } from '@/vueUtils/dateUtils';
  import { formatIntToCurrency, formatCurrencyToInt } from '@/vueUtils/currencyUtils';
  // domain
  import { dateStore } from '@/stores/dateStore';
  import MockCreditCardRepository from '@/financialManager/repositories/MockCreditCardRepository';
  import CreditCardUseCases from '@/financialManager/useCases/CreditCardUseCases';

  const date = computed(() => dateStore._ISODate);
  const repo = new MockCreditCardRepository(null);
  const useCases = new CreditCardUseCases(repo);
  const budgetID = 'mockBudgetID';
  // variávies de back-end
  const activeCreditCardID = ref(null); // variavel responsavel por rastrear o cartao ativo
  const creditCardsYearInfos = ref(null);
  const creditCardsExpenses = ref(null);
  // DOM
  const chartEl = ref(null);
  const createExpenseEl = ref(null);
  const createCreditCardEl = ref(null);
  const editEffectiveInvoiceEl = ref(null);
  const carouselEl = ref(null);
  // variaveis de front end dependentes do dominio
  const transactionTable = ref(null);
  const statistics = ref(null);
  const statisticsEffective = ref(null);

  function setChart(newID) {
    const currentCreditCardYearInfos = creditCardsYearInfos.value
      .filter(creditCardYearInfos => creditCardYearInfos.creditCard.id === newID)[0];
    const simulatedInvoices = [...currentCreditCardYearInfos.yearInvoices];
    const effectiveInvoices = currentCreditCardYearInfos.yearEffectiveInvoices
      .map(yearEffectiveInvoice => yearEffectiveInvoice.value);

    chartEl.value.setChartData([simulatedInvoices, effectiveInvoices]);
  }
  function setTable(newID) {
    const _creditCardExpenses = creditCardsExpenses.value
      .filter(creditCardExpense => creditCardExpense.creditCardID === newID)[0].monthExpenses
      .map(monthExpense => ({
        id: monthExpense.id,
        data: [
          monthExpense.description,
          monthExpense.expenseType,
          formatISOToBrDate(monthExpense.date),
          formatIntToCurrency(monthExpense.value),
        ]
      }));
    transactionTable.value = _creditCardExpenses;
  }
  function setStatistics(newID) {
    const currentCreditCardYearInfos = creditCardsYearInfos.value
      .filter(creditCardYearInfos => creditCardYearInfos.creditCard.id === newID)[0];

    const simulatedInvoices = [...currentCreditCardYearInfos.yearInvoices];
    const effectiveInvoices = currentCreditCardYearInfos.yearEffectiveInvoices
      .map(yearEffectiveInvoice => yearEffectiveInvoice.value);

    const simulatedInvoicesYearAmount = simulatedInvoices.reduce((acc, crr) => acc + crr, 0);
    const effectiveInvoicesYearAmount = effectiveInvoices.reduce((acc, crr) => acc + crr, 0);
    const simulatedInvoicesAverage = simulatedInvoicesYearAmount/12;
    const effectiveInvoicesAverage = effectiveInvoicesYearAmount/12;


    statistics.value = [
      formatIntToCurrency(simulatedInvoicesAverage),
      formatIntToCurrency(simulatedInvoicesYearAmount),
    ];
    statisticsEffective.value = [
      formatIntToCurrency(effectiveInvoicesAverage),
      formatIntToCurrency(effectiveInvoicesYearAmount),
    ];
  }
  function setCarousel(_creditCardsYearInfos) {
    const creditCardsCarouselInfos = _creditCardsYearInfos
      .map(creditCardYearInfos => {
        const month = parseISODate(date.value).month;

        return {
          id: creditCardYearInfos.creditCard.id,
          owner: creditCardYearInfos.creditCard.owner,
          operator: creditCardYearInfos.creditCard.operator,
          last4CardNumbers: creditCardYearInfos.creditCard.last4CardNumbers,
          closeDay: creditCardYearInfos.creditCard.closeDay,
          dueDay: creditCardYearInfos.creditCard.dueDay,
          simulatedMonthInvoice: creditCardYearInfos.yearInvoices[month - 1],
          // Shallow Copy
          monthEffectiveInvoice: {...creditCardYearInfos.yearEffectiveInvoices[month - 1]}
        };
    });

    carouselEl.value.setCreditCardsInfos(creditCardsCarouselInfos);
  }
  // Mutate the back-end variables
  function subtractDeletedExpense(value) {
    const month = parseISODate(date.value).month;
    const currentCreditCardYearInfos = creditCardsYearInfos.value
      .filter(creditCardYearInfos => creditCardYearInfos.creditCard.id === activeCreditCardID.value)[0];
    currentCreditCardYearInfos.yearInvoices[month - 1] -= value;
  }
  function addCreatedExpense(value, expenseDate) {
    const expenseMonth = parseISODate(expenseDate).month;
    const activeCreditCardYearInfos = creditCardsYearInfos.value
      .filter(creditCardYearInfos => creditCardYearInfos.creditCard.id === activeCreditCardID.value)[0];
    activeCreditCardYearInfos.yearInvoices[expenseMonth - 1] += value;
  }
  function editEffectiveInvoice(newMonthEffectiveInvoice) {
    const currentCreditCardYearInfos = creditCardsYearInfos.value
      .filter(creditCardYearInfos => creditCardYearInfos.creditCard.id === activeCreditCardID.value)[0];
    const currentMonthEffectiveInvoice = currentCreditCardYearInfos.yearEffectiveInvoices
      .filter(monthEffectiveInvoice => monthEffectiveInvoice.id === newMonthEffectiveInvoice.id)[0];

    currentMonthEffectiveInvoice.value = newMonthEffectiveInvoice.value;
  }
  // EVENT HANDLERS
  function onCarouselSlide(creditCardID) {
    activeCreditCardID.value = creditCardID;
  }
  async function onDeleteCreditCardExpense(expenseTableData) {
    const deletedExpense = await useCases.deleteCreditCardExpense(activeCreditCardID, expenseTableData.id);
    transactionTable.value = transactionTable.value
      .filter(tb => tb.id !== expenseTableData.id);
    carouselEl.value.subtractSimulatedInvoiceValue(
      activeCreditCardID.value,
      formatCurrencyToInt(expenseTableData.data[3])
    );
    subtractDeletedExpense(formatCurrencyToInt(expenseTableData.data[3]));
    setChart(activeCreditCardID.value);
    setStatistics(activeCreditCardID.value);
  }
  async function onCreateExpense(expense) {
    const createdExpense = await useCases.createCreditCardExpense({
      creditCardID: activeCreditCardID.value,
      description: expense.description,
      expenseType: expense.expenseType,
      date: expense.date,
      value: expense.value
    });
    //
    if (expense.date.substring(0, 7) === date.value.substring(0, 7)) {
      const expenseMonth = parseISODate(expense.date).month;
      // add expense to table
      transactionTable.value.push({
        id: createdExpense.id,
        data: [
          expense.description,
          expense.expenseType,
          formatISOToBrDate(expense.date),
          formatIntToCurrency(expense.value)
        ]
      });
      // add expense to simulated invoice
      carouselEl.value.addSimulatedInvoiceValue(activeCreditCardID.value, expense.value);
    }
    //
    addCreatedExpense(expense.value, expense.date);
    setChart(activeCreditCardID.value);
    setStatistics(activeCreditCardID.value);
  }
  async function onEditEffectiveInvoice(monthEffectiveInvoice) {
    const editedEffectiveInvoice = await useCases.updateEffectiveInvoice({
      id: monthEffectiveInvoice.id,
      creditCardID: activeCreditCardID.value,
      dueDate: monthEffectiveInvoice.date,
      value: monthEffectiveInvoice.value
    });

    editEffectiveInvoice(editedEffectiveInvoice);
    setChart(activeCreditCardID.value);
    setStatistics(activeCreditCardID.value);
    carouselEl.value.editEffectiveInvoice(activeCreditCardID.value, editedEffectiveInvoice);
  }
  function onEditEffectiveInvoiceRequest(monthEffectiveInvoice) {
    editEffectiveInvoiceEl.value.show(monthEffectiveInvoice);
  }
  function onCreateCreditCardRequest() {
    createCreditCardEl.value.show();
  }
  async function onCreateCreditCardSubmit(creditCard) {
    const creditCardYearInfos = await useCases.createCreditCard(budgetID, dateStore.toPresentISOString(), creditCard)

    creditCardsYearInfos.value.push(creditCardYearInfos);
    creditCardsExpenses.value.push({
      creditCardID: creditCardYearInfos.creditCard.id,
      monthExpenses: []
    });

    const month = parseISODate(date.value).month;
    carouselEl.value.addCreditCard(carouselCreditCardBuilder(creditCardYearInfos));
    console.log(creditCardYearInfos);
  }
  function onDeleteCreditCardRequest(creditCardID) {
    carouselEl.value.removeCreditCard(creditCardID);
    creditCardsYearInfos.value = creditCardsYearInfos.value
      .filter(creditCardYearInfos => creditCardYearInfos.creditCard.id !== creditCardID);
    creditCardsExpenses.value = creditCardsExpenses.value
      .filter(creditCardExpenses => creditCardExpenses.creditCardID !== creditCardID);
  }
  // UTILS
  function carouselCreditCardBuilder(creditCardYearInfos) {
    const month = parseISODate(date.value).month;

    return {
      id: creditCardYearInfos.creditCard.id,
      owner: creditCardYearInfos.creditCard.owner,
      operator: creditCardYearInfos.creditCard.operator,
      last4CardNumbers: creditCardYearInfos.creditCard.last4CardNumbers,
      closeDay: creditCardYearInfos.creditCard.closeDay,
      dueDay: creditCardYearInfos.creditCard.dueDay,
      simulatedMonthInvoice: creditCardYearInfos.yearInvoices[month - 1],
      monthEffectiveInvoice: {...creditCardYearInfos.yearEffectiveInvoices[month - 1]}
    };
  }

  watch(activeCreditCardID, (newID) => {
    if (newID === null) {
      chartEl.value.setChartData([]);
      transactionTable.value = [];
      statistics.value = [];
      statisticsEffective.value = [];
    }
    else {
      setChart(newID);
      setTable(newID);
      setStatistics(newID);
    }
  });
  watch(date, async (newDate, oldDate) => {
    const month = parseISODate(newDate).month;
    const year = parseISODate(newDate).year;

    if (year === parseISODate(oldDate)) {
      const creditCardsInvoces = creditCardsYearInfos.value
      .map(creditCardYearInfos => {
        return {
          creditCardID: creditCardYearInfos.creditCard.id,
          simulatedMonthInvoice: creditCardYearInfos.yearInvoices[month - 1],
          monthEffectiveInvoice: {...creditCardYearInfos.yearEffectiveInvoices[month - 1]}
        };
      });

      carouselEl.value.setInvoices(creditCardsInvoces);
      creditCardsExpenses.value = await useCases.getCreditCardsExpensesByMonth(budgetID, newDate);
    }
    else {
      creditCardsYearInfos.value = await useCases.getCreditCardsInfosByYear(budgetID, newDate);
      creditCardsExpenses.value = await useCases.getCreditCardsExpensesByMonth(budgetID, newDate);

      setCarousel([...creditCardsYearInfos.value], [...creditCardsExpenses.value]);
      setStatistics(activeCreditCardID.value);
    }

    setTable(activeCreditCardID.value);
  });

  onMounted(async () => {
    creditCardsYearInfos.value = await useCases.getCreditCardsInfosByYear(budgetID, date.value);
    creditCardsExpenses.value = await useCases.getCreditCardsExpensesByMonth(budgetID, date.value);

    setCarousel([...creditCardsYearInfos.value], [...creditCardsExpenses.value]);
  });
</script>

<template>
  <div class="container">
    <section>
      <CreditCardCarousel
        ref="carouselEl"
        :isNotDashbord="true"
        @carousel-slide="onCarouselSlide"
        @edit-effective-invoice-request="onEditEffectiveInvoiceRequest"
        @create-credit-card="onCreateCreditCardRequest"
        @delete-credit-card-request="onDeleteCreditCardRequest"
      ></CreditCardCarousel>
    </section>

    <section>
      <CreditCardYearSummaryChart
        ref="chartEl"
        :year="parseISODate(date).year"
        category="Histórico de faturas no ano"
      >
      </CreditCardYearSummaryChart>
    </section>

    <section>
      <Table
        title="Fatura Simulada"
        category="Tabela de aporte no mês"
        :headers="['Descrição', 'Categoria', 'Data', 'Valor']"
        :transaction-table="transactionTable"
        @delete-row="onDeleteCreditCardExpense"
      ></Table>
    </section>

    <section>
      <Statistic
        category="Estatísticas das Faturas Simuladas"
        title="Estatísticas Simulada"
        :statistics-data="statistics"
      ></Statistic>
      <Statistic
        category="Estatísticas das Faturas Efetivas"
        title="Estatísticas Efetiva"
        :statistics-data="statisticsEffective"
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
    <CreateCreditCard
      ref="createCreditCardEl"
      @create-credit-card-submit="onCreateCreditCardSubmit"
    ></CreateCreditCard>
    <EditEffectiveInvoice
      ref="editEffectiveInvoiceEl"
      @edit-effective-invoice="onEditEffectiveInvoice"
    ></EditEffectiveInvoice>
  </div>
</template>
