export async function addContribution(repo, contribution) {
  return await repo.createContribution(contribution);
}
