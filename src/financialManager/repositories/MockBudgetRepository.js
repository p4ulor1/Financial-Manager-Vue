import BudgetRepository from '@/financialManager/repositories/interfaces/BudgetRepository';

const PROMISE_RESOLVE_TIME = 1000;

export default class MockBudgetRepository extends BudgetRepository {
  constructor(db) {
    super(db)
  }

  getBudgets() {
    return new Promise(res => {
      setTimeout(() => {
        res([
          {id: 'budgetID_01', title: 'Orçamento 1', creationDate: '2025-01-08'},
          {id: 'budgetID_02', title: 'Orçamento 2', creationDate: '2025-02-08'},
          {id: 'budgetID_03', title: 'Orçamento 3', creationDate: '2025-03-08'}
        ]);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  createBudget(createBudget) {
    return new Promise(res => {
      setTimeout(() => {
        res({...createBudget, id: Date.now().toString()});
      }, PROMISE_RESOLVE_TIME);
    });
  }
  updateBudgetTitle(budgetID, newTitle) {
    return new Promise(res => {
      setTimeout(() => {
        res({
          id: budgetID,
          title: newTitle,
          creationDate: '2025-07-13'
        });
      }, PROMISE_RESOLVE_TIME);
    });
  }
  deleteBudget(budgetID) {
    return new Promise(res => {
      setTimeout(() => {
        res({
          id: budgetID,
          title: 'Delete budget',
          creationDate: '2025-07-13'
        });
      }, PROMISE_RESOLVE_TIME);
    });
  }
}
