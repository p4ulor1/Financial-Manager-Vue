/*
 * @param {string} currentDate - YYYY-MM-DD
 * @returns {Promise<number>} - The integer type amount
 */
export default async function getLast12MonthsAmount(repo, currentDate) {
  return await repo.getLast12MonthsAmount(currentDate);
}
