/*
 * @param {string} currentDate - YYYY-MM
 * @returns {Promise<array<number>>} - array of integers
 */
export default async function getLast12MonthsValues(repo, currentDate) {
  return await repo.getLast12MonthsValues(currentDate);
}
