export default async function getContributionsByMonth(repo, date) {
  return await repo.getContributionsByMonth(date);
}
