export default class CreditCardUseCases {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * @typedef {Object} CreditCard
   * @property {String} id
   * @property {String} owner - The length must be in range of [3 - 20]
   * @property {String} operator - The length must be in range of [4 - 20]
   * @property {String} last4CardNumbers - Must be 4 numbers
   * @property {Number} closeDay - An integer in range of [1, 31]
   * @property {Number} dueDay - An integer in range of [1, 31]
   *
   * @typedef YearEffectiveInvoice
   * @property {String} id
   * @property {String} creditCardID
   * @property {String} date
   * @property {Number} value
   *
   * @typedef {Object} CreditCardYearInfos
   * @property {CreditCard} creditCard
   * @property {Array<Number>} yearInvoices
   * @property {Array<YearEffectiveInvoice>} yearEffectiveInvoices
   *
   * @param {String} budgetID
   * @param {String} actualDate - YYYY-MM-DD
   * @returns {Array<CreditCardYearInfos>} - CreditCardsYearInfos
   */
  getCreditCardsInfosByYear(budgetID, actualDate) {
    return this.repository.getCreditCardsInfosByYear(budgetID, actualDate);
  }
  /**
   * @typedef {Object} CreditCardExpense
   * @property {String} id
   * @property {String} description - The length must be in range of [4 - 120]
   * @property {String} expenseType
   * @property {String} date - ISODate
   * @property {Number} value - Integer
   *
   * @typedef CreditCardMonthExpenses
   * @property {String} creditCardID
   * @property {Array<CreditCardExpense>} monthExpenses
   *
   * @param {String} budgetID
   * @param {String} date YYYY-MM-DD
   * @returns {Promise<Array<CreditCardMonthExpenses>>} - creditCardsMonthExpenses
   */
  getCreditCardsExpensesByMonth(budgeID, date) {
    return this.repository.getCreditCardsExpensesByMonth(budgeID, date);
  }
  /**
   * @typedef {Object} CreditCardExpense
   * @property {String} id
   * @property {String} description - The length must be in range of [4 - 120]
   * @property {String} expenseType
   * @property {String} date - ISODate
   * @property {Number} value - Integer
   *
   * @param {String} budgetID
   * @param {String} creditCardID
   * @param {String} date YYYY-MM-DD
   * @returns {Promise<Array<CreditCardExpense>>} - CreditCardMonthExpenses
   */
  getCreditCardExpensesByMonth(budgetID, creditCardID, date) {
    return this.repository.getCreditCardExpensesByMonth(budgetID, creditCardID, date);
  }
  /**
   * @typedef {Object} UpdateEffectiveInvoice
   * @property {String|Null} id
   * @property {String} creditCardID
   * @property {String} dueDate - YYYY-MM-00 (day does not needed)
   * @property {Number} value
   *
   * @typedef {Object} UpdatedEffectiveInvoice|CreatedEffectiveInvoice
   * @property {String} id
   * @property {String} creditCardID
   * @property {String} dueDate - YYYY-MM-00 (day does not needed)
   * @property {Number} value
   *
   * @param {UpdateEffectiveInvoice} updateEffectiveInvoice
   * @returns {Promise<UpdatedEffectiveInvoice|CreatedEffectiveInvoice>} - UpdatedEffectiveInvoice|CreatedEffectiveInvoice
   */
  updateEffectiveInvoice(updateEffectiveInvoice) {
    if (updateEffectiveInvoice.id === null) {
      return this.createEffectiveInvoice({
        creditCardID: updateEffectiveInvoice.creditCardID,
        dueDate: updateEffectiveInvoice.dueDate,
        value: updateEffectiveInvoice.value
      });
    }
    else
      return this.repository.updateEffectiveInvoice(updateEffectiveInvoice);
  }
  /**
  * @typedef {Object} CreateEffectiveInvoice
  * @property {String} creditCardID
  * @property {String} dueDate - YYYY-MM-00 (day does not needed)
  * @property {Number} value
  *
  * @typedef {Object} CreatedEffectiveInvoice
  * @property {String} id
  * @property {String} creditCardID
  * @property {String} dueDate - YYYY-MM-00 (day does not needed)
  * @property {Number} value
  *
  * @param {CreateEffectiveInvoice} createEffectiveInvoice
  * @returns {Promise<CreatedEffectiveInvoice>} - createdEffectiveInvoice
  */
  createEffectiveInvoice(createEffectiveInvoice) {
    return this.repository.createEffectiveInvoice(createEffectiveInvoice);
  }
  /**
   * @typedef {Object} CreateCreditCard
   * @property {string} owner
   * @property {string} operator
   * @property {string} last4CardNumbers
   * @property {number} closeDay
   * @property {number} dueDay
   *
   * @typedef {Object} CreatedCreditCard
   * @property {String} id
   * @property {String} owner
   * @property {String} operator
   * @property {String} last4CardNumbers
   * @property {Number} closeDay - An integer in range of [1, 31]
   * @property {Number} dueDay - An integer in range of [1, 31]
   *
   * @typedef YearEffectiveInvoicesValues
   * @property {Null} id
   * @property {String} creditCardID
   * @property {String} date - YYYY-MM-00
   * @property {Number} value
   *
   * @typedef {Object} CreditCardYearInfos
   * @property {String} budgetID
   * @property {CreatedCreditCard} creditCard
   * @property {Array<Number>} yearInvoicesValues
   * @property {Array<YearEffectiveInvoicesValues>} yearEffectiveInvoicesValues
   *
   * @param {String} budgetID
   * @param {String} created_at - YYYY-MM-DD
   * @param {CreateCreditCard} creditCard
   * @returns {CreditCardYearInfos}
   */
  createCreditCard(budgetID, created_at, creditCard) {
    return this.repository.createCreditCard(budgetID, created_at, creditCard);
  }
  /**
   * @typedef {Object} CreateCreditCardExpense
   * @property {String} creditCardID
   * @property {String} description
   * @property {String} expenseType
   * @property {String} date
   * @property {Number} value
   *
   * @typedef {Object} CreatedCreditCardExpense
   * @property {String} id
   * @property {String} creditCardID
   * @property {String} description
   * @property {String} expenseType
   * @property {String} date
   * @property {Number} value
   *
   * @param {CreateCreditCardExpense} createCreditCardExpense
   * @returns {CreatedCreditCardExpense}
   */
  createCreditCardExpense(createCreditCardExpense) {
    return this.repository.createCreditCardExpense(createCreditCardExpense);
  }
  /**
   * @typedef {Object} CreditCardExpense
   * @property {String} id
   * @property {String} creditCardID
   * @property {String} description
   * @property {String} expenseType
   * @property {String} date
   * @property {Number} value
   *
   * @param {String} creditCardID
   * @param {String} expenseID
   * @returns {CreditCardExpense}
   */
  deleteCreditCardExpense(creditCardID, expenseID) {
    return this.repository.deleteCreditCardExpense(creditCardID, expenseID);
  }
}
