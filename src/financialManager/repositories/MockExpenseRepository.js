import ExpenseRepository from '@/financialManager/repositories/interfaces/ExpenseRepository';
import { parseISODate } from "@/vueUtils/dateUtils";

const PROMISE_RESOLVE_TIME = 1000;
const MIN_VALUE = 25000;
const MAX_VALUE = 100000;
const VALUES = (() => {
  const values = [];

  for (let i = 0; i < 12; i++) {
    values.push(
      Number.parseInt((Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE).toString())
    );
  }

  return values;
})();

export default class MockExpenseRepository extends ExpenseRepository {
  constructor(db) {
    super(null);
  }

  getExpensesValuesByYear(budgetID, year) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(VALUES);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  getExpensesByMonth(budgetID, date) {
    const ISODate = date + '-01';
    const month = parseISODate(ISODate).month;
    const numberOfIncomes = Number.parseInt((Math.random() * (4 - 1) + 1).toString());
    const eachIncomeValue = Number.parseInt(Math.round(VALUES[month - 1] / numberOfIncomes).toString());
    const expenses = [];

    for (let i = 0; i < numberOfIncomes; i++) {
      expenses.push({
        id: `id_00${i}`,
        description: `Entrada ${i}`,
        expenseType: 'Outros',
        date: ISODate,
        value: eachIncomeValue
      });
    }

    return new Promise((res, rej) => {
      setTimeout(() => {
        res(expenses);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  createExpense(budgetID, expense) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res({id: Date.now().toString(), ...expense});
      }, PROMISE_RESOLVE_TIME);
    });
  }
  deleteExpense(budgetID, expenseToDelete) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(expenseToDelete);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  getLast12MonthsAmount(budgetID, currentDate) {
    const month = parseISODate(currentDate).month;

    return new Promise((res, rej) => {
      setTimeout(() => {
        res(VALUES.slice(0, month).reduce((acc, crr) => acc + crr,0));
      }, PROMISE_RESOLVE_TIME);
    });
  }
}
