export default class ExpenseRepository {
  constructor(db) {
    this._db = db;
  }

  /**
   * @param {String} budgetID
   * @param {String} year
   * @returns {Promise<Number>}
   * @throws {TypeError}
   */
  getExpensesValuesByYear(budgeID, year) {}

  /**
   * @typedef {Object} Expense
   * @property {String} id
   * @property {String} description
   * @property {String} expenseType
   * @property {String} date - YYYY-MM-DD
   * @property {Number} value - Integer
   *
   * @param {String} budgetID
   * @param {String} date - YYYY-MM
   * @returns {Promise<Array<Expense>>}
   * @throws {TypeError}
   */
  getExpensesByMonth(budgeID, date) {}

  /**
  * @typedef {Object} CreateExpense
  * @property {string} description
  * @property {string} expenseType
  * @property {string} date - YYYY-MM-DD
  * @property {number} value - Integer
  *
  * @typedef {Object} Expense
  * @property {string} id
  * @property {string} description
  * @property {string} expenseType
  * @property {string} date - YYYY-MM-DD
  * @property {number} value - Integer
  *
  * @param {String} budgetID
  * @param {CreateExpense} createExpense
  * @returns {Promise<Expense>}
  * @throws {TypeError}
  */
  createExpense(budgetID, createExpense) {}

  /**
   * @typedef {Object} Expense
   * @property {string} id
   * @property {string} description
   * @property {string} expenseType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - Integer
   *
   * @param {String} budgetID
   * @param {Expense} expenseToDelete
   * @returns {Promise<Expense>}
   * @throws {TypeError}
   */
  deleteExpense(budgetID, expenseToDelete) {}

  /**
   * @param {String} budgetID
   * @param {String} currentDate - YYYY-MM-DD
   * @returns {Promise<number>} - The amount in integer type
   */
  getLast12MonthsAmount(currentDate) {}
}
