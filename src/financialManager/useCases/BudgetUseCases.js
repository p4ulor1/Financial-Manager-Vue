export default class BudgetUseCases {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * @typedef {Object} Budget
   * @property {String} id
   * @property {String} title
   * @property {String} creationDate
   *
   * @returns {Promise<Array<Budget>>}
   */
  getBudgets() {
    return this.repository.getBudgets();
  }

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
  createBudget(createBudget) {
    return this.repository.createBudget(createBudget);
  }

  /**
   * @typedef {Object} Budget
   * @property {String} id
   * @property {String} title
   * @property {String} creationDate
   *
   * @param {String} budgetID
   * @param {String} newTitle
   * @returns {Promise<Budget>}
   */
  updateBudgetTitle(budgetID, newTitle) {
    return this.repository.updateBudgetTitle(budgetID, newTitle);
  }

  /**
   * @typedef {Object} Budget
   * @property {String} id
   * @property {String} title
   * @property {String} creationDate
   *
   * @param {String} budgetID
   * @returns {Promise<Budget>}
   */
  deleteBudget(budgetID) {
    return this.repository.deleteBudget(budgetID);
  }
}
