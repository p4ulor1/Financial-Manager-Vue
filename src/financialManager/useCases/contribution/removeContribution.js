export async function removeContribution(repo, contributionID) {
  return await repo.deleteContribution(contributionID);
}
