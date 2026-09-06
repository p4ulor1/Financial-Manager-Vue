export default class BudgetRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * @typedef {Object} Budget
   * @property {String} id
   * @property {String} title
   * @property {String} creationDate
   *
   * @returns {Promise<Array<Budget>>}
   */
  getBudgets() {}
  /**
   * @typedef {Object} CreateBudget
   * @property {String} title
   * @property {String} creationDate
   *
   * @typedef {Object} Budget
   * @property {String} id
   * @property {String} title
   * @property {String} creationDate
   *
   * @param {CreateBudget} createBudget
   * @returns {Promise<Budget>}
   */
  createBudget(createBudget) {}
  /**
   * @typedef {Object} Budget
   * @property {String} id
   * @property {String} title
   * @property {String} creationDate
   *
   * @returns {Promise<Budget>}
   */
  updateBudgetTitle(budgetID, newTitle) {}
  /**
   * @typedef {Object} Budget
   * @property {String} id
   * @property {String} title
   * @property {String} creationDate
   *
   * @param {String} budgetID
   * @returns {Promise<Budget>}
   */
  deleteBudget(budgetID) {}
}
