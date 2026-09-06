const INVALID_DATE_MSG = 'The "date" parameter must be a String in "YYYY-MM" format!';

export default class TrasactionUseCases {
  constructor(repository) {
    this.repository = repository
  }

  /**
   * @param {String} budgetID
   * @param {String} currentDate - YYYY-MM
   * @returns {Promise<Number>} - The amount in integer type
   */
  getLast12MonthsAmount(budgetID, currentDate) {
    this._validateMonthDate(currentDate);

    return this.repository.getLast12MonthsAmount(budgetID, currentDate + '00');
  }

  _validateMonthDate(date) {
    if (typeof date !== 'string')
      throw new TypeError(INVALID_DATE_MSG);
    else if (date.length !== 7)
      throw new TypeError(INVALID_DATE_MSG);

    const matchDate = date.match(/\d{4}-\d{2}/);

    if (matchDate === null)
      throw new TypeError(INVALID_DATE_MSG);

    const year = date.slice(0, 4);
    const month = date.slice(5);

    if (Number.parseInt(year) < 1000 || Number.parseInt(year) > 9999)
      throw new TypeError(INVALID_DATE_MSG);
    else if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12)
      throw new TypeError(INVALID_DATE_MSG);
  }
}
