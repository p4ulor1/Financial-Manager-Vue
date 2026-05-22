/*
 * @param {string} value
 * @returns {string} A currency representation
 */
export function formatCurrency(value) {
  let currency = value.replace(/\D/g, '');
  currency = (Number.parseInt(currency) / 100).toFixed(2) + '';
  currency = currency.replace('.', ',');
  currency = currency.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  return currency;
}
/*
 * @param {string} currency
 * @returns {number} The interger value
 */
export function formatCurrencyToInt(currency) {
  let int = currency.replace(/\D/g, '');
  int = Number.parseInt(int);

  return int;
}
export function formatIntToCurrency(int) {
  let currency = (int / 100).toFixed(2);
  currency = currency.replace('.', ',');
  currency = currency.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  return currency;
}
