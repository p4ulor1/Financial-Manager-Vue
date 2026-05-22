import IncomeRepository from "@/financialManager/repositories/interfaces/IncomeRepository.js";
import { isValidISODate } from "@/vueUtils/dateUtils";
import { areArraysEqual } from '@/vueUtils/areArraysEqual';

const PROMISE_RESOLVE_TIME = 1000;

export default class MockIncomeRepository extends IncomeRepository {
  constructor() {
    super(null)
  }

  createIncome(income) {
    this._validateCreateIncome(income);

    return new Promise((res, rej) => {
      setTimeout(() => {
        res({id: `${Date.now()}`, ...income});
      }, PROMISE_RESOLVE_TIME);
    });
  };
  getIncomesByMonth(date) {
    if (!isValidISODate(date + '-01'))
      throw new Error('The date must be a string in format: YYYY-MM');

    return new Promise((res, rej) => {
      setTimeout(() => {
        // res([]);
        res([
          {id: '1', description: "Despesa 1", incomeType: 'Renda Trabalho', date: '2026-05-05', value: 442822},
          {id: '2', description: "Despesa 2", incomeType: 'Renda Extra', date: '2026-05-11', value: 45621},
          {id: '3', description: "Despesa 3", incomeType: 'Renda Extra', date: '2026-05-21', value: 36514}
        ]);
      }, PROMISE_RESOLVE_TIME);
    });
  };
  getIncomesValueByYear(year) {
    if (!Number.isInteger(year))
      throw new Error(`The year must be Integer type but '${typeof year}' type was passed`);
    if (year < 1000 || year > 9999)
      throw new Error(`An invalid year was passed. It must be an integer in a range of 1000 and 9999 but '${year}' was passed`);

    return new Promise((res, rej) => {
      setTimeout(() => {
        res([524957, 524957, 524957, 524957, 524957, 524957, 524957, 524957, 524957, 524957, 524957, 524957]);
      }, PROMISE_RESOLVE_TIME);
    });
  };
  getLast12MonthsValues(currentDate) {
    this._validateDate(currentDate);

    return new Promise((res, rej) => {
      setTimeout(() => {
        res([0, 0, 0, 0, 0, 0, 524957, 524957, 524957, 524957, 524957, 524957]);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  deleteIncome(income) {
    const expectedArr = ['id', 'description', 'incomeType', 'date', 'value'];
    const receivedArr = Object.getOwnPropertyNames(income);

    if (!areArraysEqual(
      receivedArr,
      expectedArr
    )) {
      throw new Error(`Invalid object properties passed. Expected: ${expectedArr}; Received: ${receivedArr}`);
    };

    if (typeof income.id !== 'string')
      throw new Error(`The income ID must be String type but "${typeof incomeId}" was passed`);

    return new Promise((res, rej) => {
      setTimeout(() => {
        res(income);
      }, PROMISE_RESOLVE_TIME);
    });
  };
};
