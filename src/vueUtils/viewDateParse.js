/**
 *  
 * @param {String} stringDate YYYY-MM-DD
 * @returns {String} DD/MM/YYYY
 */
export function viewDateParse(stringDate) {
  const [year, month, day] = stringDate.split('-');

  return `${day}/${month}/${year}`;
}