/*
 * @typedef {Object} Expense
 * @property {string} id
 * @property {string} description
 * @property {string} expenseType
 * @property {string} date - YYYY-MM-DD
 * @property {number} value - The expense values multiplied by 100
 *
 * @typedef {Object} ExpenseID
 * @property {string} id
 * @property {any} description
 * @property {any} expenseType
 * @property {any} date
 * @property {any} value
 *
 * @param {ExpenseRepository} repo
 * @param {ExpenseID} expense
 * @returns {Promise<Expense>}
 */
export default async function removeExpense(repo, expense) {
  return await repo.deleteExpense(expense);
}
