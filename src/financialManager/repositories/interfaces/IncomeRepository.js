import { isValidISODate } from '@/vueUtils/dateUtils';
import { areArraysEqual } from '@/vueUtils/areArraysEqual';

export default class IncomeRepository {
  constructor(db) {
    this._db = db;
  }

  /**
   * @typedef {Object} CreateIncome
   * @property {string} description
   * @property {string} incomeType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - value multiplied by 100
   *
   * @typedef {Object} Income
   * @property {string} id
   * @property {string} description
   * @property {string} incomeType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - value multiplied by 100
   *
   * @param {String} budgetID
   * @param {CreateIncome} income
   * @returns {Promise<Income>}
   */
  createIncome(income) {}

  /**
   * @typedef {Object} Income
   * @property {String} id
   * @property {String} description
   * @property {String} incomeType
   * @property {String} date - YYYY-MM-DD
   * @property {Number} value - The income values multiplied by 100
   *
   * @param {String} budgetID
   * @param {String} date - YYYY-MM-00
   * @returns {Promise<Array<Income>>}
   */
  getIncomesByMonth(budgetID, date) {}

  /**
   * @param {String} budgetID
   * @param {String} year
   * @returns {Promise<Number>} incomesValues
   */
  getIncomesValuesByYear(budgetID, year) {}

  /**
   * @param {String} budgetID
   * @param {String} currentDate - YYYY-MM-DD
   * @returns {Promise<number>} - The amount in integer type
   */
  getLast12MonthsAmount(currentDate) {}

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
  deleteIncome(budgetID, incomeToRemove) {}

  // VALIDATORS
  _validateIncome(income) {
    const expectedArr = ['id', 'description', 'incomeType', 'date', 'value'];
    const receivedArr = Object.getOwnPropertyNames(income)

    if (!areArraysEqual(
      receivedArr,
      expectedArr
    )) {
      throw new Error(`Invalid object properties passed. Expected: ${expectedArr}; Received: ${receivedArr}`);
    };

    this._validateDescription(income.description);
    this._validateDate(income.date);
    this._validateValue(income.value);
  }
  _validateCreateIncome(income) {
    const expectedArr = ['description', 'incomeType', 'date', 'value'];
    const receivedArr = Object.getOwnPropertyNames(income)

    if (!areArraysEqual(
      receivedArr,
      expectedArr
    )) {
      throw new Error(`Invalid object properties passed. Expected: ${expectedArr}; Received: ${receivedArr}`);
    }

    this._validateDescription(income.description);
    this._validateDate(income.date);
    this._validateValue(income.value);
  }
  _validateDescription(description) {
    if (typeof description !== 'string') throw new Error('The description must be a string type');
    if (description.length < 1) throw new Error('The description dont have to be a empty string!');
  }
  _validateDate(date) {
    if (!isValidISODate(date)) throw new Error('The date must be a string in format: YYYY-MM-DD');
  }
  _validateValue(value) {
    if (!Number.isInteger(value)) throw new Error('The value must be integer type');
  }
}
