/*
 * Entidade de Dominio
 * @typedef {Object} Income
 *
 * @typedef {Object} creator_Income
 * @property {string} description
 * @property {string} incomeType
 * @property {string} date - YYYY-MM-DD
 * @property {number} value - value multiplied by 100
 *
 * @param {IncomeRepository} repo
 * @param {creator_income} income
 * @returns {Income}
*/
export default async function addIncome(repo, income) {
  return await repo.createIncome(income);
}
