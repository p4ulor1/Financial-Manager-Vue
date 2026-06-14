import { formatIntToCurrency } from "@/vueUtils/currencyUtils";

/*
 * @param {Number} last12MonthsAmount - An integer value
 * @param {Array<Number>} transactionYearValeus - A 12 length array with integer values
 * @returns {Array<Number>} - A 3 length array with yearAverage, last12MonthsAverage and yearAmount values in this order
 */
export default function statisticsBuilder(last12MonthsAmount, transactionYearValeus) {
  const last12MonthsAverage = last12MonthsAmount/12;
  const yearAmount = transactionYearValeus.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  const yearAverage = yearAmount/12;

  return [formatIntToCurrency(yearAverage), formatIntToCurrency(last12MonthsAverage), formatIntToCurrency(yearAmount)];
}
