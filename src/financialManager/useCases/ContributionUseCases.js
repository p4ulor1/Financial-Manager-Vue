import IncomeUseCases from '@/financialManager/useCases/IncomeUseCases';
import TransactionUseCases from "@/financialManager/useCases/TransactionUseCases";
import {
  isValidYearStr,
  isValidISODate,
  isValidDescription,
  isValidMonthDate
} from '@/financialManager/utils/validators';

const INVALID_YEAR_MSG = 'The "year" parameter must be String type, and the year must be in range of [1000, 9999]!';
const INVALID_BUDGETID_TYPE_MSG = 'The "budgetID" parameter must be String type!';
const INVALID_DATE_MSG = 'The "date" parameter must be a String in "YYYY-MM" format!';
const INVALID_CREATE_CONTRIBUTION_MSG = 'The "createContribution" parameter must be a Object with description, date, value propeties!';
const INVALID_CREATE_CONTRIBUTION_DESCRIPTION_PROPERTIES = "The description property must be a String with length in range of [4, 120]!";
const INVALID_CREATE_CONTRIBUTION_DATE_PROPERTIES = "The date property must be a String in \"YYYY-MM-DD\" format!";
const INVALID_CREATE_CONTRIBUTION_VALUE_PROPERTIES = "The value property must be a Integer!";
const INVALID_CONTRIBUTIONID_TYPE_MSG = 'The "contributionID" parameter must be String type!';
const INVALID_ISO_DATE = "The date parameter must be a String in \"YYYY-MM-DD\" format!";

export default class ContributionUseCases extends TransactionUseCases {
  constructor(repository) {
    super(repository);
  }

  /**
   * @param {String} budgetID
   * @param {String} year
   * @returns {Promise<Number>}
   * @throws {TypeError}
   */
  getContributionsValuesByYear(budgetID, year) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);
    else if (!isValidYearStr(year))
      throw new TypeError(INVALID_YEAR_MSG);

    return this.repository.getContributionsValuesByYear(budgetID, year);
  }

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
   * @throws {TypeError}
   */
  getContributionsByMonth(budgetID, date) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);
    if (!isValidMonthDate(date))
      throw new TypeError(INVALID_DATE_MSG);

    return this.repository.getContributionsByMonth(budgetID, date);
  }

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
   * @throws {TypeError}
   */
  createContribution(budgetID, createContribution) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);
    this._validateCreateContributionObject(createContribution);

    return this.repository.createContribution(budgetID, createContribution);
  }

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
  deleteContribution(budgetID, contributionToRemove) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);

    return this.repository.deleteContribution(budgetID, contributionToRemove);
  }

  /**
   * @param {String} budgetID
   * @returns {Promise<Number>}
   */
  getTotalContributions(budgetID) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);

    return this.repository.getTotalContributions(budgetID);
  }

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
   * @param {Object} incomeRepository
   * @returns {Promise<Income>}
   */
  async redeemContribution(budgetID, contributionToRedeem, date, incomeRepository) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);
    else if (!isValidISODate(date))
      throw new TypeError(INVALID_ISO_DATE);

    const incomeUseCases = new IncomeUseCases(incomeRepository);
    const redeemedContribution = await this.repository.redeemContribution(budgetID,  contributionToRedeem, date);

    await incomeUseCases.createIncome(budgetID, {
      description: redeemedContribution.description,
      incomeType: "Resgate de Investimento",
      date: date,
      value: redeemedContribution.value
    });

    return redeemedContribution;
  }

  _validateCreateContributionObject(createContribution) {
    const validProperties = ['description', 'date', 'value'];
    const properties = Object.getOwnPropertyNames(createContribution);

    if (properties.length > 3 && !properties.every((property, i) => property === validProperties[i]))
      throw new TypeError(INVALID_CREATE_CONTRIBUTION_MSG);
    else if (!isValidDescription(createContribution.description))
      throw new TypeError(INVALID_CREATE_CONTRIBUTION_DESCRIPTION_PROPERTIES);
    else if (!isValidISODate(createContribution.date))
      throw new TypeError(INVALID_CREATE_CONTRIBUTION_DATE_PROPERTIES);
    else if (typeof createContribution.value !== 'number')
      throw new TypeError(INVALID_CREATE_CONTRIBUTION_VALUE_PROPERTIES);
    else if (!Number.isInteger(createContribution.value))
      throw new TypeError(INVALID_CREATE_CONTRIBUTION_VALUE_PROPERTIES);
  }
}
