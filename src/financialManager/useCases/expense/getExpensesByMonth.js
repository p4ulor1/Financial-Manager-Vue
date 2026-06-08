/*
 * @typedef {Object} Expense
 * @property {String} id
 * @property {String} description
 * @property {String} expenseType
 * @property {String} date - ISODate
 * @property {Number} value - Integer
 *
 * @param {ExpenseRepository} repo
 * @param {String} monthDate - YYYY-MM
 * @returns {Array<Expense>}
 */
export default async function getExpensesByMonth(repo, monthDate) {
  return await repo.getExpensesByMonth(monthDate);
}
