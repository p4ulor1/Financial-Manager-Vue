export async function redeemContribution(repo, contributionID, date) {
  return await repo.redeemContribution(contributionID, date);
}
