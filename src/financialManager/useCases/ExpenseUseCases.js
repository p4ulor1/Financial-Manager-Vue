import TrasactionUseCases from '@/financialManager/useCases/TransactionUseCases';
import {
  isValidYearStr,
  isValidISODate,
  isValidDescription,
  isValidMonthDate
} from '@/financialManager/utils/validators';

const INVALID_YEAR_MSG = 'The "year" parameter must be String type, and the year must be in range of [1000, 9999]!';
const INVALID_BUDGETID_TYPE_MSG = "The \"budgetID\" parameter must be String type, but it's ";
const INVALID_DATE_MSG = 'The "date" parameter must be a String in "YYYY-MM-DD" format!';
const INVALID_CREATE_EXPENSE_MSG = 'The "createExpense" parameter must be a Object with description, expenseType, date, value propeties!';
const INVALID_CREATE_EXPENSE_DESCRIPTION_PROPERTIES = "The description property must be a String with length in range of [4, 120]!";
const INVALID_CREATE_EXPENSE_EXPENSETYPE_PROPERTIES = "The expenseType property must be a String!";
const INVALID_CREATE_EXPENSE_DATE_PROPERTIES = "The date property must be a String in \"YYYY-MM-DD\" format!";
const INVALID_CREATE_EXPENSE_VALUE_PROPERTIES = "The value property must be a Integer!";
const INVALID_EXPENSEID_TYPE_MSG = 'The "expenseID" parameter must be String type!';

export default class ExpenseUseCases extends TrasactionUseCases {
  constructor(repository) {
    super(repository);
  }

  /**
   * @param {String} budgetID
   * @param {String} year
   * @returns {Promise<Number>}
   * @throws {TypeError}
   */
  getExpensesValuesByYear(budgetID, year) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG + `${typeof budgetID}`);
    else if (!isValidYearStr(year))
      throw new TypeError(INVALID_YEAR_MSG);

    return this.repository.getExpensesValuesByYear(budgetID, year);
  }

  /**
   * @typedef {Object} Expense
   * @property {String} id
   * @property {String} description
   * @property {String} expenseType
   * @property {String} date - YYYY-MM-DD
   * @property {Number} value - Integer
   *
   * @param {String} budgetID
   * @param {String} date - YYYY-MM
   * @returns {Promise<Array<Expense>>}
   * @throws {TypeError}
   */
  getExpensesByMonth(budgetID, date) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);
    if (!isValidMonthDate(date))
      throw new TypeError(INVALID_DATE_MSG);

    return this.repository.getExpensesByMonth(budgetID, date);
  }

  /**
   * @typedef {Object} CreateExpense
   * @property {string} description
   * @property {string} expenseType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - Integer
   *
   * @typedef {Object} Expense
   * @property {string} id
   * @property {string} description
   * @property {string} expenseType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - Integer
   *
   * @param {String} budgetID
   * @param {CreateExpense} createExpense
   * @returns {Promise<Expense>}
   * @throws {TypeError}
   */
  createExpense(budgetID, createExpense) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);
    this._validateCreateExpense(createExpense);

    return this.repository.createExpense(budgetID, createExpense);
  }

  /**
   * @typedef {Object} Expense
   * @property {string} id
   * @property {string} description
   * @property {string} expenseType
   * @property {string} date - YYYY-MM-DD
   * @property {number} value - Integer
   *
   * @param {String} budgetID
   * @param {Expense} expenseToDelete
   * @returns {Promise<Expense>}
   * @throws {TypeError}
   */
  deleteExpense(budgetID, expenseToDelete) {
    if (typeof budgetID !== 'string')
      throw new TypeError(INVALID_BUDGETID_TYPE_MSG);

    return this.repository.deleteExpense(budgetID, expenseToDelete);
  }

  _validateCreateExpense(createExpense) {
    const validProperties = ['description', 'expenseType', 'date', 'value'];
    const properties = Object.getOwnPropertyNames(createExpense);

    if (properties.length > 4 && !properties.every((property, i) => property === validProperties[i]))
      throw new TypeError(INVALID_CREATE_EXPENSE_MSG);
    else if (!isValidDescription(createExpense.description))
      throw new TypeError(INVALID_CREATE_EXPENSE_DESCRIPTION_PROPERTIES);
    else if (typeof createExpense.expenseType !== 'string')
      throw new TypeError(INVALID_CREATE_EXPENSE_EXPENSETYPE_PROPERTIES);
    else if (!isValidISODate(createExpense.date))
      throw new TypeError(INVALID_CREATE_EXPENSE_DATE_PROPERTIES);
    else if (typeof createExpense.value !== 'number')
      throw new TypeError(INVALID_CREATE_EXPENSE_VALUE_PROPERTIES);
    else if (!Number.isInteger(createExpense.value))
      throw new TypeError(INVALID_CREATE_EXPENSE_VALUE_PROPERTIES);
  }
}
