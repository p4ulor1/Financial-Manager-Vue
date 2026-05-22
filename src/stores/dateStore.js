import { reactive } from 'vue';
import {
  isValidISODate,
  parseISODate
} from '@/vueUtils/dateUtils';

const INVALID_DATE_MSG = 'The date must be a string in the following format: YYYY-MM-DD';

export const dateStore = reactive({
  _currentDate: new Date(),
  _date: new Date(),
  _ISODate: (new Date()).toISOString().match(/\d{4}-\d{2}-\d{2}/)[0],
  // GETTERS
  /*
   * returns {string} Date in YYYY-MM-DD format
   */
  toCurrentISOString() {
    return this._currentDate.toISOString().match(/\d{4}-\d{2}-\d{2}/)[0];
  },
  /*
   * returns {string} Date in YYYY-MM-DD format
   */
  toISOString() {
    return this._date.toISOString().match(/\d{4}-\d{2}-\d{2}/)[0];
  },
  // SETTERS
  /*
   * @param {string} date - YYYY-MM-DD
   * @returns {string} - The date in YYYY-MM-DD format
   * @throws {SyntaxError}
   */
  setDate(date) {
    if (!isValidISODate(date))
      throw new SyntaxError(INVALID_DATE_MSG);

    const parsedDate = parseISODate(date);

    this._date = new Date(parsedDate.year, parsedDate.month - 1, parsedDate.day);
    this._ISODate = this.toISOString();

    return `${parsedDate.year}-${parsedDate.month}-${parsedDate.day}`;
  }
});
