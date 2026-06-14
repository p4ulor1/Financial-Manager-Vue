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
  import { getContributionsValueByYear } from "@/financialManager/useCases/contribution/getContributionsValueByYear";
  import { getContributionsByMonth } from "@/financialManager/useCases/contribution/getContributionsByMonth";
  import { getLast12MonthsAmount } from "@/financialManager/useCases/contribution/getLast12MonthsAmount";
  import { getTotalContributions } from "@/financialManager/useCases/contribution/getTotalContributions";
  import { addContribution } from "@/financialManager/useCases/contribution/addContribution";
  import { removeContribution } from "@/financialManager/useCases/contribution/removeContribution";
  import { redeemContribution } from "@/financialManager/useCases/contribution/redeemContribution";

  const repo = new MockContributionRepository();
  const date = computed(() => dateStore._ISODate);
  // DOM
  const chartEl = ref(null);
  const createContributionEl = ref(null);
  // Variáveis de domínio
  const yearContributionsValue = ref(null);
  const monthContributions = ref(null);
  const last12MonthsAmount = ref(null);
  const totalContribution = ref(null);
  // variaveis de front end dependentes do dominio
  const tableData = computed(() => {
    if (monthContributions.value === null) return null;

    return monthContributions.value.map(contribution => ({
      id: contribution.id,
      data: [
        contribution.description,
        formatISOToBrDate(contribution.date),
        formatIntToCurrency(contribution.value),
      ]
    }));
  })
  const monthContribution = computed(() => {
    if (yearContributionsValue.value === null) return null;

    const month = parseISODate(date.value).month;

    return formatIntToCurrency(yearContributionsValue.value[month - 1]);
  })
  const totalContributionView = computed(() => {
    if (totalContribution.value === null) return null;

    return formatIntToCurrency(totalContribution.value);
  })
  const statisticsData = computed(() => {
    if (last12MonthsAmount.value === null && yearContributionsValue.value === null) return null ;

    return statisticsBuilder(last12MonthsAmount.value, yearContributionsValue.value);
  });

  // Watch yearContributionsValue to update the chart
  watch(yearContributionsValue, (newContributionsValue) => {
    chartEl.value.setChartData(newContributionsValue);
  }, { deep: true });
  // Watch date
  watch(date, async (newDate, oldDate) => {
    const contributions = await getContributionsByMonth(repo, date.value);
    monthContributions.value = contributions;

    const parsedNewDate = parseISODate(newDate);
    const parsedOldDate = parseISODate(oldDate);

    if (parsedNewDate.year !== parsedOldDate.year) {
      const contributionsValue = await getContributionsValueByYear(repo, parseISODate(date.value).year);
      yearContributionsValue.value = contributionsValue;
    };
  });

  // METHODS
  async function onCreateContribution(contribution) {
    const parsedCreateContribution = {
      description: contribution.description,
      date: formatBrDateToISO(contribution.date),
      value: formatCurrencyToInt(contribution.value)
    };
    const createdContribution = await addContribution(repo, parsedCreateContribution);
    const month = parseISODate(createdContribution.date).month;

    monthContributions.value.push(createdContribution);
    yearContributionsValue.value[month - 1] += createdContribution.value;
    last12MonthsAmount.value = await getLast12MonthsAmount(repo, date.value);
  }
  async function onDeleteContribution(dtbContribution) {
    const parsedRemoveContribution = {
      id: dtbContribution.id,
      description: dtbContribution.data[0],
      date: formatBrDateToISO(dtbContribution.data[1]),
      value: formatCurrencyToInt(dtbContribution.data[2])
    };
    const removedContribution = await removeContribution(repo, parsedRemoveContribution);
    const month = parseISODate(removedContribution.date).month;

    monthContributions.value = monthContributions.value.filter(dtb => dtb.id !== removedContribution.id);
    yearContributionsValue.value[month - 1] -= removedContribution.value;
    last12MonthsAmount.value = await getLast12MonthsAmount(repo, date.value);
  }
  async function onRedeemContribution(dtbContribution) {
    const parsedRemoveContribution = {
      id: dtbContribution.id,
      description: dtbContribution.data[0],
      date: formatBrDateToISO(dtbContribution.data[1]),
      value: formatCurrencyToInt(dtbContribution.data[2])
    };
    const redeemedContribution = await removeContribution(repo, parsedRemoveContribution);
    const month = parseISODate(redeemedContribution.date).month;

    monthContributions.value = monthContributions.value.filter(dtb => dtb.id !== redeemedContribution.id);
    yearContributionsValue.value[month - 1] -= redeemedContribution.value;
    last12MonthsAmount.value = await getLast12MonthsAmount(repo, date.value);
  }

  onMounted(() => {
    getContributionsValueByYear(repo, parseISODate(date.value).year).then(values => {
      yearContributionsValue.value = values;
    });
    getContributionsByMonth(repo, date.value).then(contributions => {
      monthContributions.value = contributions;
    });
    getLast12MonthsAmount(repo, date.value).then(amount => {
      last12MonthsAmount.value = amount;
    });
    getTotalContributions(repo).then(total => {
      totalContribution.value = total;
    })
  });
</script>

<template>
  <div class="container">
    <section>
      <InfoCard
      :icon-color="2"
      :info="[totalContributionView, monthContribution]"
      :category="['Aporte Total', 'Aporte do mês']"
      :sub-info="[
        'Aporte Total: Representa o acumulado de todo o período',
        'Aporte do mês: Representa o total do mês'
      ]"
      icon="bi-piggy-bank-fill  "
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
        :table-data="tableData"
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
