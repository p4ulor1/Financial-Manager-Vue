import { reactive } from 'vue';
import {
  isValidISODate,
  parseISODate,
  formatBrDateToISO
} from '@/vueUtils/dateUtils';

const INVALID_DATE_MSG = 'The date must be a string in the following format: YYYY-MM-DD';
const LOCALE = 'pt-BR';
const LOCALE_STRING_OPTIONS = {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}

export const dateStore = reactive({
  _currentDate: new Date(),
  _date: new Date(),
  _ISODate: formatBrDateToISO((new Date()).toLocaleString(LOCALE, LOCALE_STRING_OPTIONS)),
  // GETTERS
  /*
   * returns {string} Date in YYYY-MM-DD format
   */
  toCurrentISOString() {
    return formatBrDateToISO(this._currentDate.toLocaleString(LOCALE, LOCALE_STRING_OPTIONS));
  },
  /*
   * returns {string} Date in YYYY-MM-DD format
   */
  toPresentISOString() {
    return formatBrDateToISO(this._currentDate.toLocaleString(LOCALE, LOCALE_STRING_OPTIONS));
  },
  /*
   * returns {string} Date in YYYY-MM-DD format
   */
  toISOString() {
    return formatBrDateToISO(this._date.toLocaleString(LOCALE, LOCALE_STRING_OPTIONS));
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

    return this._date;
  }
});
