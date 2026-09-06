import ContributionRepository from "@/financialManager/repositories/interfaces/ContributionRepository";
import { parseISODate } from "@/vueUtils/dateUtils";

const PROMISE_RESOLVE_TIME = 1000;
const MIN_VALUE = 10000;
const MAX_VALUE = 70000;
const VALUES = (() => {
  const values = [];

  for (let i = 0; i < 12; i++) {
    values.push(
      Number.parseInt((Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE).toString())
    );
  }

  return values;
})();

export default class MockContributionRepository extends ContributionRepository {
  constructor(db) {
    super(db);
  }

  getContributionsValuesByYear(budgetID, year) {
    return new Promise(res => {
      setTimeout(() => {
        res(VALUES);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  getContributionsByMonth(budgetID, date) {
    const ISODate = date + '-01';
    const month = parseISODate(ISODate).month;
    const numberOfContributions = Number.parseInt((Math.random() * (3 - 1) + 1).toString());
    const eachContributionValue = Number.parseInt(Math.round(VALUES[month - 1] / numberOfContributions).toString());
    const contributions = [];

    for (let i = 0; i < numberOfContributions; i++) {
      contributions.push({
        id: `id_00${i}`,
        description: `Aporte ${i}`,
        date: ISODate,
        value: eachContributionValue
      });
    }

    return new Promise((res, rej) => {
      setTimeout(() => {
        res(contributions);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  createContribution(budgetID, contribution) {
    const id = Date.now();

    return new Promise(res => {
      setTimeout(() => {
        res({id: id.toString(), ...contribution});
      }, PROMISE_RESOLVE_TIME);
    });
  }
  deleteContribution(budgetID, contributionToRemove) {
    return new Promise(res => {
      setTimeout(() => {
        res(contributionToRemove);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  getTotalContributions() {
    return new Promise(res => {
      setTimeout(() => {
        res(VALUES.reduce((acc, crr) => acc + crr, 0));
      }, PROMISE_RESOLVE_TIME);
    });
  }
  redeemContribution(budgetID, contributionToRedeem, date) {
    return new Promise(res => {
      setTimeout(() => {
        res(contributionToRedeem);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  getLast12MonthsAmount(budgetID, currentDate) {
    const month = parseISODate(currentDate).month;

    return new Promise((res, rej) => {
      setTimeout(() => {
        res(VALUES.slice(0, month).reduce((acc, crr) => acc + crr, 0));
      }, PROMISE_RESOLVE_TIME);
    });
  }
}
