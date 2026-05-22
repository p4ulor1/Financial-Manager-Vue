import { isValidISODate } from '@/vueUtils/dateUtils';
import { areArraysEqual } from '@/vueUtils/areArraysEqual';

export default class IncomeRepository {
  constructor(db) {
    this._db = db;
  }

  /*
   * @typedef {Object} Income
   * @property {string} id
   * @property {string} description
   * @property {string} incomeType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - value multiplied by 100
   *
   * @typedef {Object} creator_Income
   * @property {string} description
   * @property {string} incomeType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - value multiplied by 100
   *
   * @param {creator_Income} income
   * @returns {Promise<Income>}
   */
  async createIncome(income) {}
  /*
   * @typedef {Object} Income
   * @property {string} id
   * @property {string} description
   * @property {string} incomeType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - The income values multiplied by 100
   *
   * @param {string} date - YYYY-MM
   * @returns {Promise<Array<Income>>}
   */
  async getIncomesByMonth(date) {}
  /*
   * @param {number} year - Integer
   * @returns {Promise<array<number>>} array of integers
   */
  async getIncomesValueByYear(year) {}
  /*
   * @param {string} currentDate - YYYY-MM-DD
   * @returns {Promise<array<number>>} - array of integers
   */
  async getLast12MonthsValues(currentDate) {}
  /*
   * @typedef {Object} Income
   * @property {string} id
   * @property {string} description
   * @property {string} incomeType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - The income values multiplied by 100
   *
   * @typedef {Object} IncomeID
   * @property {string} id
   * @property {any} description
   * @property {any} incomeType
   * @property {any} date
   * @property {any} value
   *
   * @param {IncomeID} income
   * @returns {Promise<Income>}
   */
  async deleteIncome(income) {}

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
