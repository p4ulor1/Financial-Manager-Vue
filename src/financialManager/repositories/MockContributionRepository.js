import ContributionRepository from "@/financialManager/repositories/interfaces/ContributionRepository";
import { parseISODate } from "@/vueUtils/dateUtils";

const PROMISE_RESOLVE_TIME = 1000;
const CONTRIBUTIONS_VALUE = [21437, 48912, 30564, 42108, 23791, 36450, 47823, 29905, 33341, 41276, 20188, 49559]

export default class MockContributionRepository extends ContributionRepository {
  constructor(db) {
    super(db);
  }

  getContributionsValueByYear(year) {
    return new Promise(res => {
      setTimeout(() => {
        res(CONTRIBUTIONS_VALUE);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  getContributionsByMonth(date) {
    const parsedDate = parseISODate(date);
    const month = parsedDate.month;
    const contribution = {
      id: '',
      description: 'Aporte Mensal',
      date: date,
      value: CONTRIBUTIONS_VALUE[month - 1]
    };

    return new Promise(res => {
      setTimeout(() => {
        res([contribution]);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  getLast12MonthsAmount(date) {
    const parsedDate = parseISODate(date);
    const month = parsedDate.month;

    return new Promise(res => {
      setTimeout(() => {
        res(CONTRIBUTIONS_VALUE.slice(0, month).reduce((acc, crr) => acc + crr), 0);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  getTotalContributions() {
    return new Promise(res => {
      setTimeout(() => {
        res(CONTRIBUTIONS_VALUE.reduce((acc, crr) => acc + crr, 0));
      }, PROMISE_RESOLVE_TIME);
    });
  }
  createContribution(contribution) {
    const id = Date.now();

    return new Promise(res => {
      setTimeout(() => {
        res({id: id, ...contribution});
      }, PROMISE_RESOLVE_TIME);
    });
  }
  deleteContribution(contributionID) {
    return new Promise(res => {
      setTimeout(() => {
        res(contributionID)
      }, PROMISE_RESOLVE_TIME);
    });
  }
  redeemContribution(contributionID, date) {
    return new Promise(res => {
      setTimeout(() => {
        res(contributionID)
      }, PROMISE_RESOLVE_TIME);
    });
  }

}
