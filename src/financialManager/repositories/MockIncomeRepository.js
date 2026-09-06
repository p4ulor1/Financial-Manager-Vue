import IncomeRepository from "@/financialManager/repositories/interfaces/IncomeRepository.js";
import { isValidISODate, parseISODate } from "@/vueUtils/dateUtils";
import { areArraysEqual } from '@/vueUtils/areArraysEqual';

const PROMISE_RESOLVE_TIME = 1000;
const MIN_INCOME_VALUE = 250000;
const MAX_INCOME_VALUE = 400000;
const INCOMES_VALUES = (() => {
  const incomesValues = [];

  for (let i = 0; i < 12; i++) {
    incomesValues.push(
      Number.parseInt((Math.random() * (MAX_INCOME_VALUE - MIN_INCOME_VALUE) + MIN_INCOME_VALUE).toString())
    );
  }

  return incomesValues;
})();

export default class MockIncomeRepository extends IncomeRepository {
  constructor() {
    super(null);
  }

  getIncomesValuesByYear(budgetID, year) {

    return new Promise((res, rej) => {
      setTimeout(() => {
        res(INCOMES_VALUES);
      }, PROMISE_RESOLVE_TIME);
    });
  };
  getIncomesByMonth(budgetID, date) {
    const ISODate = date + '-01';
    const month = parseISODate(ISODate).month;
    const numberOfIncomes = Number.parseInt((Math.random() * (4 - 1) + 1).toString());
    const eachIncomeValue = Number.parseInt(Math.round(INCOMES_VALUES[month - 1] / numberOfIncomes).toString());
    const incomes = [];

    for (let i = 0; i < numberOfIncomes; i++) {
      incomes.push({
        id: `id_00${i}`,
        description: `Entrada ${i}`,
        incomeType: 'Renda Trabalho',
        date: ISODate,
        value: eachIncomeValue
      });
    }

    return new Promise((res, rej) => {
      setTimeout(() => {
        res(incomes);
      }, PROMISE_RESOLVE_TIME);
    });
  };
  createIncome(budgetID, income) {

    return new Promise((res, rej) => {
      setTimeout(() => {
        res({id: `${Date.now()}`, ...income});
      }, PROMISE_RESOLVE_TIME);
    });
  };
  deleteIncome(budgetID, incomeToRemove) {

    return new Promise((res, rej) => {
      setTimeout(() => {
        res(incomeToRemove);
      }, PROMISE_RESOLVE_TIME);
    });
  };
  getLast12MonthsAmount(budgetID, currentDate) {
    const month = parseISODate(currentDate).month;

    return new Promise((res, rej) => {
      setTimeout(() => {
        res(INCOMES_VALUES.slice(0, month).reduce((acc, crr) => acc + crr,0));
      }, PROMISE_RESOLVE_TIME);
    });
  }
};
