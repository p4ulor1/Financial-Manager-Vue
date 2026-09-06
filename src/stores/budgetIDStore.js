import { reactive } from 'vue';

export const budgetIDStore = reactive({
  budgetID: null,
  setBudgetID(budgetID) {
    this.budgetID = budgetID;
  }
});
