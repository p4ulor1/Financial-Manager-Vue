export default class ContributionRepository {
  constructor(db) {
    this._db = db;
  }

  /**
   * @param {String} budgetID
   * @param {String} year
   * @returns {Promise<Number>}
   */
  getContributionsValuesByYear(budgetID, year) {}

  /**
   * @typedef {Object} Contribution
   * @property {String} id
   * @property {String} description
   * @property {String} date - YYYY-MM-DD
   * @property {Number} value - Integer
   *
   * @param {String} budgetID
   * @param {String} date - YYYY-MM
   * @returns {Promise<Array<Contribution>>}
   */
  getContributionsByMonth(budgetID, date) {}

  /**
   * @typedef {Object} CreateContribution
   * @property {string} description
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - Integer
   *
   * @typedef {Object} Contribution
   * @property {string} id
   * @property {string} description
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - Integer
   *
   * @param {String} budgetID
   * @param {CreateContribution} createContribution
   * @returns {Promise<Expense>}
   */
  createContribution(budgetID, createContribution) {}

  /**
   * @typedef {Object} Contribution
   * @property {string} id
   * @property {string} description
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - Integer
   *
   * @param {String} budgetID
   * @param {Contribution} contributionToRemove
   * @returns {Promise<Contribution>}
   */
  deleteContribution(budgetID, contributionToRemove) {}

  /**
   * @param {String} budgetID
   * @returns {Promise<Number>}
   */
  getTotalContributions(budgetID) {}

  /**
   * Delete the redeemed contribution and save it in the income table with the "Resgate de Investimento" incomeType
   *
   * @typedef {Object} Contribution
   * @property {string} id
   * @property {string} description
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - Integer
   *
   * @typedef {Object} Income
   * @property {string} id
   * @property {string} description
   * @property {string} incomeType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - Integer
   *
   * @param {String} budgetID
   * @param {Contribution} contributionToRedeem
   * @param {String} date - YYYY-MM-DD (date of redeem)
   * @returns {Promise<Income>}
   */
  redeemContribution(budgetID, contributionToRedeem, date) {}

  /**
   * @param {String} budgetID
   * @param {String} currentDate - YYYY-MM-DD
   * @returns {Promise<number>} - The amount in integer type
   */
  getLast12MonthsAmount(currentDate) {}
}
