export default class ContributionRepository {
  constructor(db) {
    this._db = db;
  }

  /*
   * @param {Number} year
   * @returns {Array<Number>} - An array of 12 Integers
   */
  getContributionsValueByYear(year) {}
  /*
   * @typedef {Object} Contribution
   * @property {String} id
   * @property {String} description
   * @property {String} date - ISODate
   * @property {Number} value - Integer
   *
   * @param {String} date YYYY-MM-DD
   * @returns {Array<Contribution>}
   */
  getContributionsByMonth(date) {}
  /*
   * @param {string} date - present date YYYY-MM-DD
   * @returns {Promise<number>} - An integer value
   */
   getLast12MonthsAmount(date) {}
   /*
    *@returns {Promise<Number>} - The integer type of total
    */
   getTotalContributions() {}
   /*
    * @typedef {Object} Contribution
    * @property {string} id
    * @property {string} description
    * @property {string} date - YYYY-MM-DD
    * @property {number} value - value in integer type
    *
    * @typedef {Object} creator_Contribution
    * @property {string} description
    * @property {string} date - YYYY-MM-DD
    * @property {number} value - value in integer type
    *
    * @param {creator_Contribution} contribution
    * @returns {Promise<Contribution>}
    */
   createContribution(contribution) {}
   /*
    * @typedef {Object} Contribution
    * @property {string} id
    * @property {string} description
    * @property {string} date - YYYY-MM-DD
    * @property {number} value - value in integer type
    *
    * @typedef {Object} ContributionID
    * @property {string} id
    *
    * @param {ContributionID} contributionID
    * @returns {Promise<Contribution>}
    */
   deleteContribution(contributionID) {}
   /*
    * Delete the redeemed contribution and save it in the income table with the "Investimento" incomeType
    *
    * @typedef {Object} Contribution
    * @property {string} id
    * @property {string} description
    * @property {string} date - YYYY-MM-DD
    * @property {number} value - value in integer type
    *
    * @typedef {Object} ContributionID
    * @property {string} id
    *
    * @param {ContributionID} contributionID
    * @param {String} date - YYYY-MM-DD (date of redeem)
    * @returns {Promise<Contribution>}
    */
   redeemContribution(contributionID, date) {}
}
