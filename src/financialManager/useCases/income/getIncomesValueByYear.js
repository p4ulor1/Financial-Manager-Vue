/*
 * Get a list of income values in a year
 * @param {IncomeRepository} repo
 * @param {number} year - The year represented by integer
 * @returns {Promise<Array<number>>} The incomes values multiplied by 100
 */
export default async function getIncomesValueByYear(repo, year) {
  return (await repo.getIncomesValueByYear(year)).map(incomeValue => incomeValue === null ? 0 : incomeValue);
}
