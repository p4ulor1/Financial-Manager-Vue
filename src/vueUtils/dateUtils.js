/**
 * Exported Modules
 *
 * isValidMonthDate
 * StrDateBuilder
 * parseISODate
 * parseBrDate
 * isValidDate
 * isValidISODate
 * isValidBrDate
 * formatBrDateToISO
 * formatBrDate
 * formatISOToBrDate
 */

 function isValidMonthDate(date) {
   if (typeof date !== 'string')
     return false;
   else if (date.length !== 7)
     return false;

   const matchDate = date.match(/\d{4}-\d{2}/);

   if (matchDate === null)
     return false;

   const year = date.slice(0, 4);
   const month = date.slice(5);

   if (Number.parseInt(year) < 1000 || Number.parseInt(year) > 9999)
     return false;
   else if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12)
     return false;

   return true;
 }
/*
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @param {string} dateType - ISODate|BrDate
 * @returns {string} DD/MM/YYYY
 */
function StrDateBuilder(day, month, year, dateType) {
  const strDay = day < 10 ? `0${day.toString()}` : day.toString();
  const strMonth = month < 10 ? `0${month.toString()}` : month.toString();
  const strYear = year.toString();

  switch (dateType) {
    case 'ISODate':
      return `${strYear}-${strMonth}-${strDay}`;
    case 'BrDate':
      return `${strDay}/${strMonth}/${strYear}`;
  }
}

 /*
  * @typedef {Object} ParsedDate
  * @property {number} day
  * @property {number} month
  * @property {number} year
  *
  * @param {string} date
  * @returns {ParsedDate}
  */
function parseISODate(date) {
   const day = Number.parseInt(date.substring(8));
   const month = Number.parseInt(date.substring(5, 7));
   const year = Number.parseInt(date.substring(0, 4));

   return {day: day, month: month, year: year};
 };

 /*
  * @typedef {Object} ParsedDate
  * @property {number} day
  * @property {number} month
  * @property {number} year
  *
  * @param {string} date - DD/MM/YYYY
  * @returns {ParsedDate}
  */
function parseBrDate(date) {
   const day = Number.parseInt(date.substring(0, 2));
   const month = Number.parseInt(date.substring(3, 5));
   const year = Number.parseInt(date.substring(6));

   return {day: day, month: month, year: year};
 };

/*
 * @param {number} day - Integer day
 * @param {number} month - Integer month
 * @param {number} year - Integer year
 * @returns {boolean}
 */
function isValidDate(day, month, year) {
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 1000) return false;

  return true;
};

/*
 * @param {string} date
 * @returns {Bolean}
*/
function isValidISODate(date) {
  if (typeof date !== 'string')
    return false;
  else if (date.length !== 10)
    return false;

  const matchDate = date.match(/\d{4}-\d{2}-\d{2}/);

  if (matchDate.length !== 1)
    return false;

  const parsedDate = parseISODate(date);

  if (!isValidDate(parsedDate.day, parsedDate.month, parsedDate.year))
    return false;

  return true;
}

/*
 * @param {string} date
 * @returns {string|false}
*/
function isValidBrDate(date) {
  if (typeof date !== 'string') return false;
  if (date.length !== 10) return false;

  const parsedDate = parseBrDate(date);

  if (isValidDate(parsedDate.day, parsedDate.month, parsedDate.year))
    return date;
  else
    return false;
};

/*
 * @param {string} brDate - DD/MM/YYYY
 * @returns {string} - YYYY-MM-DD
 */
function formatBrDateToISO(brDate) {
  const day = Number.parseInt(brDate.substring(0, 2));
  const month = Number.parseInt(brDate.substring(3, 5));
  const year = Number.parseInt(brDate.substring(6));

  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};

/*
 * @param {string} value
 * @returns {string} A date in a formate DD/MM/YYYY
 */
function formatBrDate(value) {
  let date = value;
  date = date.replace(/\D/g, '');
  if (date.length > 2) date = date.substring(0, 2) + '/' + date.substring(2);
  if (date.length > 5) date = date.substring(0, 5) + '/' + date.substring(5, 9);
  return date;
};

/*
 *
 * @param {String} stringDate YYYY-MM-DD
 * @returns {String} DD/MM/YYYY
 */
function formatISOToBrDate(stringDate) {
  const [year, month, day] = stringDate.split('-');

  return `${day}/${month}/${year}`;
};

export {
  isValidMonthDate,
  StrDateBuilder,
  parseISODate,
  parseBrDate,
  isValidDate,
  isValidISODate,
  isValidBrDate,
  formatBrDateToISO,
  formatBrDate,
  formatISOToBrDate
};
