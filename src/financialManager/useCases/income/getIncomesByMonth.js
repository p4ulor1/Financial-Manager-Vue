import { formatIsoToBrDate } from '@/vueUtils/formatIsoToBrDate';

/*
 * @typedef {Object} Income
 * @property {string} id
 * @property {string} description
 * @property {string} incomeType
 * @property {string} date - YYYY-MM-DD
 * @property {number} value - The income values multiplied by 100

 * @param {IncomeRepository} repo
 * @param {string} date - YYYY-MM
 * @returns {Array<Income>}
 */
export default async function getIncomesByMonth(repo, date) {
  const incomes = await repo.getIncomesByMonth(date);
  return incomes.map(income => ({
    id: income.id,
    description: income.description,
    incomeType: income.incomeType,
    date: income.date,
    value: income.value
  }));
}
