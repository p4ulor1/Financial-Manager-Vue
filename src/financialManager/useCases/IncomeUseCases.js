import TrasactionUseCases from '@/financialManager/useCases/TransactionUseCases';
import {
  isValidYearStr,
  isValidISODate,
  isValidDescription,
  isValidMonthDate
} from '@/financialManager/utils/validators';

const INVALID_YEAR_MSG = 'The "year" parameter must be String type, and the year must be in range of [1000, 9999]!';
const INVALID_BUDGETID_TYPE_MSG = 'The "budgetID" parameter must be String type!';
const INVALID_INCOMEID_TYPE_MSG = 'The "incomeID" parameter must be String type!';
const INVALID_DATE_MSG = 'The "date" parameter must be a String in "YYYY-MM" format!';
const INVALID_CREATE_INCOME_MSG = 'The "createIncome" parameter must be a Object with description, incomeType, date, value propeties!';
const INVALID_CREATE_INCOME_DESCRIPTION_PROPERTIES = "The description property must be a String with length in range of [4, 120]!";
const INVALID_CREATE_INCOME_INCOMETYPE_PROPERTIES = "The incomeType property must be a String!";
const INVALID_CREATE_INCOME_DATE_PROPERTIES = "The date property must be a String in \"YYYY-MM-DD\" format!";
const INVALID_CREATE_INCOME_VALUE_PROPERTIES = "The value property must be a Integer!";

export default class IncomeUseCases extends TrasactionUseCases{
  constructor(repository) {
    super(repository);
  }

  /**
   * @param {String} budgetID
   * @param {String} year
   * @returns {Promise<Number>}
   * @throws {TypeError}
   */
  getIncomesValuesByYear(budgetID, year) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);
    else if (!isValidYearStr(year))
      throw new TypeError(INVALID_YEAR_MSG);

    return this.repository.getIncomesValuesByYear(budgetID, year);
  }

  /**
   * @typedef {Object} Income
   * @property {String} id
   * @property {String} description
   * @property {String} incomeType
   * @property {String} date - YYYY-MM-DD
   * @property {Number} value - Integer
   *
   * @param {String} budgetID
   * @param {String} date - YYYY-MM
   * @returns {Promise<Array<Income>>}
   * @throws {TypeError}
   */
  getIncomesByMonth(budgetID, date) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);
    if (!isValidMonthDate(date))
      throw new TypeError(INVALID_DATE_MSG);

    return this.repository.getIncomesByMonth(budgetID, date);
  }

  /**
   * @typedef {Object} CreateIncome
   * @property {string} description
   * @property {string} incomeType
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
   * @param {CreateIncome} createIncome
   * @returns {Promise<Income>}
   * @throws {TypeError}
   */
  createIncome(budgetID, createIncome) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);
    this._validateCreateIncomeObject(createIncome);

    return this.repository.createIncome(budgetID, createIncome);
  }

  /**
   * @typedef {Object} Income
   * @property {string} id
   * @property {string} description
   * @property {string} incomeType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value
   *
   * @param {String} budgetID
   * @param {Income} incomeToRemove
   * @returns {Promise<Income>}
   * @throws {TypeError}
   */
  deleteIncome(budgetID, incomeToRemove) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);

    return this.repository.deleteIncome(budgetID, incomeToRemove);
  }

  _validateCreateIncomeObject(createIncome) {
    const validProperties = ['description', 'incomeType', 'date', 'value'];
    const properties = Object.getOwnPropertyNames(createIncome);

    if (properties.length > 4 && !properties.every((property, i) => property === validProperties[i]))
      throw new TypeError(INVALID_CREATE_INCOME_MSG);
    else if (!isValidDescription(createIncome.description))
      throw new TypeError(INVALID_CREATE_INCOME_DESCRIPTION_PROPERTIES);
    else if (typeof createIncome.incomeType !== 'string')
      throw new TypeError(INVALID_CREATE_INCOME_INCOMETYPE_PROPERTIES);
    else if (!isValidISODate(createIncome.date))
      throw new TypeError(INVALID_CREATE_INCOME_DATE_PROPERTIES);
    else if (typeof createIncome.value !== 'number')
      throw new TypeError(INVALID_CREATE_INCOME_VALUE_PROPERTIES);
    else if (!Number.isInteger(createIncome.value))
      throw new TypeError(INVALID_CREATE_INCOME_VALUE_PROPERTIES);
  }
}
