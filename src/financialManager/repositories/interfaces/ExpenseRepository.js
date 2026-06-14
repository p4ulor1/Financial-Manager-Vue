export default class ExpenseRepository {
  constructor(db) {
    this._db = db;
  }

  /*
   * @param {Numbar} year
   * @returns {Array<Number>} - An array of 12 Integers
   */
  getExpenseValuesByYear(year) {}
  /*
   * @typedef {Object} Expense
   * @property {String} id
   * @property {String} description
   * @property {String} expenseType
   * @property {String} date - ISODate
   * @property {Number} value - Integer
   *
   * @param {String} monthDate
   * @returns {Array<Expense>}
   */
  getExpensesByMonth(monthDate) {}
  /*
   * @param {string} currentDate - YYYY-MM-DD
   * @returns {Promise<number>} - The integer type amount
   */
   getLast12MonthsAmount(date) {}
   /*
    * @typedef {Object} Expense
    * @property {string} id
    * @property {string} description
    * @property {string} expenseType
    * @property {string} date - YYYY-MM-DD
    * @property {number} value - value multiplied by 100
    *
    * @typedef {Object} creator_Expense
    * @property {string} description
    * @property {string} expenseType
    * @property {string} date - YYYY-MM-DD
    * @property {number} value - value multiplied by 100
    *
    * @param {creator_Expense} expense
    * @returns {Promise<Expense>}
    */
   createExpense(expense) {}
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
    * @param {ExpenseID} expense
    * @returns {Promise<Expense>}
    */
   deleteExpense(expense) {}
}
