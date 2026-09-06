<script setup>
  import { colors } from '@/assets/js/utils/colors';
  import InfoCard from '@/components/InfoCard.vue';
  import Statistic from '@/components/Statistic.vue';
  import Table from '@/components/Table.vue';
  import FloatBtn  from '@/components/FloatBtn.vue';
  import TrasactionYearSummaryChart from '@/components/TrasactionYearSummaryChart.vue';
  import CreateContribution from "@/components/modals/CreateContribution.vue";
  import { parseISODate, formatISOToBrDate, formatBrDateToISO } from "@/vueUtils/dateUtils";
  import { formatIntToCurrency, formatCurrencyToInt } from "@/vueUtils/currencyUtils";
  import statisticsBuilder from "@/vueUtils/statisticsBuilder";
  import { dateStore } from "@/stores/dateStore";
  import { ref, onMounted, computed, watch } from 'vue';
  // Domain
  import MockContributionRepository from "@/financialManager/repositories/MockContributionRepository";
  import MockIncomeRepository from "@/financialManager/repositories/MockIncomeRepository";
  import ContributionUseCases from "@/financialManager/useCases/ContributionUseCases";

  const repo = new MockContributionRepository(null);
  const useCases = new ContributionUseCases(repo);
  const budgetID = 'budgetIDMock';
  const date = computed(() => dateStore._ISODate);
  // DOM
  const chartEl = ref(null);
  const createContributionEl = ref(null);
  // Variáveis de domínio
  const yearContributionsValues = ref(null);
  const monthContributions = ref(null);
  const totalContribution = ref(null);
  // variaveis de front end dependentes do dominio
  const transactionTable = ref(null);
  const monthContributionAmount = ref(null);
  const statisticsData = ref(null);
  const totalContributionView = computed(() => {
    if (totalContribution.value === null) return null;

    return formatIntToCurrency(totalContribution.value);
  })

  // Watch date
  watch(date, async (newDate, oldDate) => {
    if (parseISODate(newDate).year === parseISODate(oldDate).year) {
      setMonthContribution(yearContributionsValues.value, parseISODate(newDate).month);
    }
    else {
      const contributionsValuesByYear = await useCases.getContributionsValuesByYear(
        budgetID,
        parseISODate(date.value).year.toString()
      );

      yearContributionsValues.value = contributionsValuesByYear;
      setChart(contributionsValuesByYear);
      setMonthContribution(contributionsValuesByYear);
      setStatisticsData(contributionsValuesByYear);
    }

    const contributionsByMonth = await useCases.getContributionsByMonth(
      budgetID,
      date.value.slice(0, 7)
    );

    monthContributions.value = contributionsByMonth;
    setContributionsTable(contributionsByMonth);
  });

  // Methods
  function setChart(contributionsValuesByYear) {
    chartEl.value.setChartData(contributionsValuesByYear);
  }
  function setMonthContribution(contributionsValuesByYear, month = null) {
    if (month === null)
      month = parseISODate(date.value).month;

    monthContributionAmount.value = formatIntToCurrency(contributionsValuesByYear[month - 1]);
  }
  function setContributionsTable(contributionsByMonth) {
    transactionTable.value = contributionsByMonth
      .map(monthExpense => {
        return {
          id: monthExpense.id,
          data: [
            monthExpense.description,
            formatISOToBrDate(monthExpense.date),
            formatIntToCurrency(monthExpense.value)
          ]
        };
      });
  }
  function setStatisticsData(contributionsValuesByYear) {
    statisticsData.value = statisticsBuilder(contributionsValuesByYear);
  }
  function addTotalContribution(value) {
    totalContribution.value += value;
  }
  function subtractTotalContribution(value) {
    totalContribution.value -= value;
  }
  async function onCreateContribution(contribution) {
    const createdContribution = await useCases.createContribution(budgetID, contribution);
    const month = parseISODate(createdContribution.date).month;

    if (createdContribution.date.slice(0, 7) === date.value.slice(0, 7))
      monthContributions.value.push(createdContribution);
    if (createdContribution.date.slice(0, 4) === date.value.slice(0, 4))
      yearContributionsValues.value[month - 1] += createdContribution.value;

    addTotalContribution(createdContribution.value);
    setChart(yearContributionsValues.value);
    setMonthContribution(yearContributionsValues.value);
    setContributionsTable(monthContributions.value);
    setStatisticsData(yearContributionsValues.value);
  }
  async function onDeleteContribution(contributionTable) {
    const contributionToRemove = {
      id: contributionTable.id,
      description: contributionTable.data[0],
      date: formatBrDateToISO(contributionTable.data[1]),
      value: formatCurrencyToInt(contributionTable.data[2]),
    };
    const removedContribution = await useCases.deleteContribution(
      budgetID,
      contributionToRemove
    );
    const month = parseISODate(removedContribution.date).month;

    if (removedContribution.date.slice(0, 7) === date.value.slice(0, 7))
      monthContributions.value = monthContributions.value.filter(dtb => dtb.id !== removedContribution.id);
    if (removedContribution.date.slice(0, 4) === date.value.slice(0, 4))
      yearContributionsValues.value[month - 1] -= removedContribution.value;

    subtractTotalContribution(removedContribution.value);
    setChart(yearContributionsValues.value);
    setMonthContribution(yearContributionsValues.value);
    setContributionsTable(monthContributions.value);
    setStatisticsData(yearContributionsValues.value);
  }
  async function onRedeemContribution(contributionTable) {
    const incomeRepository = new MockIncomeRepository(null);
    const contributionToRedeemed = {
      id: contributionTable.id,
      description: contributionTable.data[0],
      date: formatBrDateToISO(contributionTable.data[1]),
      value: formatCurrencyToInt(contributionTable.data[2]),
    };
    const redeemedContribution = await useCases.redeemContribution(
      budgetID,
      contributionToRedeemed,
      dateStore.toCurrentISOString(),
      incomeRepository
    );
    const month = parseISODate(redeemedContribution.date).month;

    if (redeemedContribution.date.slice(0, 7) === date.value.slice(0, 7))
      monthContributions.value = monthContributions.value
        .filter(dtb => dtb.id !== redeemedContribution.id);
    if (redeemedContribution.date.slice(0, 4) === date.value.slice(0, 4))
      yearContributionsValues.value[month - 1] -= redeemedContribution.value;

    subtractTotalContribution(redeemedContribution.value);
    setChart(yearContributionsValues.value);
    setMonthContribution(yearContributionsValues.value);
    setContributionsTable(monthContributions.value);
    setStatisticsData(yearContributionsValues.value);
  }

  onMounted(async () => {
    const contributionsValuesByYear = await useCases.getContributionsValuesByYear(
      budgetID,
      parseISODate(date.value).year.toString()
    );
    const contributionsByMonth = await useCases.getContributionsByMonth(
      budgetID,
      date.value.slice(0, 7)
    );
    const totalContributionsAmount = await useCases.getTotalContributions(budgetID);

    yearContributionsValues.value = contributionsValuesByYear;
    monthContributions.value = contributionsByMonth;
    totalContribution.value = totalContributionsAmount;
    setChart(contributionsValuesByYear);
    setMonthContribution(contributionsValuesByYear);
    setContributionsTable(contributionsByMonth);
    setStatisticsData(contributionsValuesByYear);
  });
</script>

<template>
  <div class="container">
    <section>
      <InfoCard
      :icon-color="2"
      :info="[totalContributionView, monthContributionAmount]"
      :category="['Aporte Total', 'Aporte do mês']"
      :sub-info="[
        'Aporte Total: Representa o acumulado de todos os anos',
        'Aporte do mês: Representa o total do mês'
      ]"
      icon="bi-piggy-bank-fill"
      ></InfoCard>
    </section>

    <section>
      <TrasactionYearSummaryChart
        ref="chartEl"
        category="Histórico de aportes no ano"
        :year="parseISODate(date).year"
        label="Aporte"
        :chart-bg-color="colors.info"
      ></TrasactionYearSummaryChart>
    </section>

    <section>
      <Table
        @delete-row="onDeleteContribution"
        @redeem-contribution="onRedeemContribution"
        category="Tabela de aporte no mês"
        :headers="['Objetivo', 'Data', 'Valor']"
        :transaction-table="transactionTable"
        :isContribution="true"
      ></Table>
    </section>

    <section>
      <Statistic
        :statistics-data="statisticsData"
      ></Statistic>
    </section>

    <FloatBtn @click="createContributionEl.show()">
      <i class="bi bi-plus-lg"></i>
    </FloatBtn>

    <CreateContribution
      ref="createContributionEl"
      @create-contribution-submit="onCreateContribution"
    ></CreateContribution>
  </div>
</template>

<style lang="scss" scoped></style>
