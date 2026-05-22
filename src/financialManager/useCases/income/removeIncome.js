/*
 * @typedef {Object} Income
 * @property {string} id
 * @property {string} description
 * @property {string} incomeType
 * @property {string} date - YYYY-MM-DD
 * @property {number} value - The income values multiplied by 100
 *
 * @typedef {Object} IncomeID
 * @property {string} id
 * @property {any} description
 * @property {any} incomeType
 * @property {any} date
 * @property {any} value
 *
 * @param {IncomeRepository} repo
 * @param {IncomeID} income
 * @returns {Promise<Income>}
 */
export default async function removeIncome(repo, income) {
  return await repo.deleteIncome(income);
}
