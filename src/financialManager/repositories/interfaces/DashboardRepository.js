export default class DashboardRepository {
  constructor(db) {
    this._db = db;
  }

  /**
   * @param {String} budgetID
   * @param {String} date - YYYY-MM-DD
   * @returns {Promise<Array<Number>>} - incomesValuesByYear
   */
  getIncomesValuesByYear(budgetID, date) {}

  /**
   * @param {String} budgetID
   * @param {String} date - YYYY-MM-DD
   * @returns {Promise<Array<Number>>} - expensesValuesByYear
   */
  getExpensesValuesByYear(budgetID, date) {}

  /**
   * @typedef {Object} CreditCard
   * @property {String} id
   * @property {String} owner - The length must be in range of [3 - 20]
   * @property {String} operator - The length must be in range of [4 - 20]
   * @property {String} last4CardNumbers - Must be 4 numbers
   * @property {Number} closeDay - An integer in range of [1, 31]
   * @property {Number} dueDay - An integer in range of [1, 31]
   *
   * @typedef {Object} CreditCardInvoices
   * @property {Object} creditCard
   * @property {Array<Number>} simulatedInvoicesValuesByYear
   * @property {Array<Number>} effectiveInvoicesValuesByYear
   *
   * @param {String} budgetID
   * @param {String} date - YYYY-MM-DD
   * @returns {Promise<Array<CreditCardInvoices>>} - creditCardInvoices
   */
  getCreditCardsInvoicesValueByYear(budgetID, date) {}

  /**
   * @param {String} budgetID
   * @param {String} date - YYYY-MM-DD
   * @returns {Promise<Array<Number>>} - incomesValuesByYear
   */
  getContributionsValuesByYear(budgetID, date) {}
}
