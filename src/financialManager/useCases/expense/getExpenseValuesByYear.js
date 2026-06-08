/*
 * @param {ExpenseRepository} repo
 * @param {Numbar} year
 * @returns {Array<Number>} - An array of 12 Integers
 */
export default async function getExpenseValuesByYear(repo, year) {
  return await repo.getExpenseValuesByYear(year);
}
