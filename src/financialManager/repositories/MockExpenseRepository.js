import ExpenseRepository from '@/financialManager/repositories/interfaces/ExpenseRepository';

const PROMISE_RESOLVE_TIME = 1000;

export default class MockExpenseRepository extends ExpenseRepository {
  constructor(db) {
    super(null);
  }

  getExpenseValuesByYear(year) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res([524957, 524957, 524957, 524957, 524957, 524957, 524957, 524957, 524957, 524957, 524957, 524957]);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  getExpensesByMonth(monthDate) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res([
          {id: '1', description: "Despesa 1", expenseType: 'Mercado', date: '2026-05-05', value: 442822},
          {id: '2', description: "Despesa 2", expenseType: 'Mercado', date: '2026-05-11', value: 45621},
          {id: '3', description: "Despesa 3", expenseType: 'Mercado', date: '2026-05-21', value: 36514}
        ]);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  getLast12MonthsValues(date) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res([0, 0, 0, 0, 0, 0, 524957, 524957, 524957, 524957, 524957, 524957]);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  createExpense(expense) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res({id: Date.now().toString(), ...expense});
      }, PROMISE_RESOLVE_TIME);
    });
  }
  deleteExpense(expense) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(expense);
      }, PROMISE_RESOLVE_TIME);
    });
  }
}
