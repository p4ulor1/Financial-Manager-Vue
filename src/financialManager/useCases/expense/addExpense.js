/*
 * Entidade de Dominio
 * @typedef {Object} Expense
 *
 * @typedef {Object} creator_expense
 * @property {string} description
 * @property {string} expenseType
 * @property {string} date - YYYY-MM-DD
 * @property {number} value - value multiplied by 100
 *
 * @param {IncomeRepository} repo
 * @param {creator_expense} expense
 * @returns {Expense}
*/
export default async function addExpense(repo, expense) {
  return await repo.createExpense(expense);
}
