/*
 * EXPORTS
 *
 * formatCurrency,
 * formatCurrencyToInt,
 * formatIntToCurrency
 */

/*
 * @param {string} value
 * @returns {string} A currency representation
 */
function formatCurrency(value) {
  let currency = value.replace(/\D/g, '');
  if (currency.length === 0) return '';

  currency = (Number.parseInt(currency) / 100).toFixed(2) + '';
  currency = currency.replace('.', ',');
  currency = currency.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  return currency;
}
/*
 * @param {string} currency
 * @returns {number} The interger value
 */
function formatCurrencyToInt(currency) {
  let int = currency.replace(/\D/g, '');
  int = Number.parseInt(int);

  return int;
}
function formatIntToCurrency(int) {
  let currency = (int / 100).toFixed(2);
  currency = currency.replace('.', ',');
  currency = currency.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  return currency;
}

export {
  formatCurrency,
  formatCurrencyToInt,
  formatIntToCurrency
}
