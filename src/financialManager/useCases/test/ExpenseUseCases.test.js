import ExpenseUseCases from '@/financialManager/useCases/ExpenseUseCases';
import MockExpenseRepository from '@/financialManager/repositories/MockExpenseRepository';

describe('Testing ExpenseUseCases', () => {
  const budgetID = 'budgetIDMock';

  describe('Testing getExpensesValuesByYear method', async () => {
    const repo = new MockExpenseRepository(null);
    const spyRepo = vi.spyOn(repo, 'getExpensesValuesByYear');
    const useCase = new ExpenseUseCases(repo);
    const year = '2026';
    const expensesValues = await useCase.getExpensesValuesByYear(budgetID, year);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call ExpenseRepository.getExpensesValuesByYear', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetID, year);
    });
    test('Must return an array of integers', () => {
      expect(expensesValues).toBeInstanceOf(Array);
      expect(expensesValues).toHaveLength(12);
      expensesValues.forEach(expenseValue => {
        expect(Number.isInteger(expenseValue)).toBeTruthy();
      });
    });
  });

  describe('Testing getExpensesByMonth', async () => {
    const repo = new MockExpenseRepository(null);
    const spyRepo = vi.spyOn(repo, 'getExpensesByMonth');
    const useCase = new ExpenseUseCases(repo);
    const monthDate = '2026-07';
    const expenses = await useCase.getExpensesByMonth(budgetID, monthDate);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call ExpenseRepository.getExpensesByMonth', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetID, monthDate);
    });
    test('Must return an array of Expenses', () => {
      expect(expenses).toBeInstanceOf(Array);
      expenses.forEach(expense => {
        expect(expense.id).toBeTypeOf('string');
        expect(expense.description).toBeTypeOf('string');
        expect(expense.expenseType).toBeTypeOf('string');
        expect(expense.date).toBeTypeOf('string');
        expect(Number.isInteger(expense.value)).toBeTruthy();
      });
    });
  });

  describe('Testing createExpense', async () => {
    const repo = new MockExpenseRepository(null);
    const spyRepo = vi.spyOn(repo, 'createExpense');
    const useCase = new ExpenseUseCases(repo);
    const createExpense = {
      description: 'Expense',
      expenseType: 'Outros',
      date: '2026-07-06',
      value: 123456
    };
    const createdExpense = await useCase.createExpense(budgetID, createExpense);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call ExpenseRepository.createExpense', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetID, createExpense);
    });
    test('Must return the created Expense', () => {
      expect(createdExpense.id).toBeTypeOf('string');
      expect(createdExpense.description).toEqual(createExpense.description);
      expect(createdExpense.expenseType).toEqual(createExpense.expenseType);
      expect(createdExpense.date).toEqual(createExpense.date);
      expect(createdExpense.value).toEqual(createExpense.value);
    });
  });

  describe('Testing deleteExpense', async () => {
    const repo = new MockExpenseRepository(null);
    const spyRepo = vi.spyOn(repo, 'deleteExpense');
    const useCase = new ExpenseUseCases(repo);
    const expenseID = 'id_01';
    const deletedExpense = await useCase.deleteExpense(budgetID, expenseID);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call ExpenseRepositoy.deleteExpense', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetID, expenseID);
    });
    test('Must return the deleted expense', () => {
      expect(deletedExpense.id).toEqual(expenseID);
      expect(deletedExpense.description).toBeTypeOf('string');
      expect(deletedExpense.expenseType).toBeTypeOf('string');
      expect(deletedExpense.date).toBeTypeOf('string');
      expect(Number.isInteger(deletedExpense.value)).toBeTruthy();
    });
  });

  describe('Testing getLast12MonthsAmount', async () => {
    const repo = new MockExpenseRepository(null);
    const spyRepo = vi.spyOn(repo, 'getLast12MonthsAmount');
    const useCase = new ExpenseUseCases(repo);
    const currentDate = '2026-07';
    const last12MonthsAmount = await useCase.getLast12MonthsAmount(budgetID, currentDate);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call ExpenseRepository.getLast12MonthsAmount', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetID, currentDate);
    });
    test('Must return the sum of last 12 months', () => {
      expect(Number.isInteger(last12MonthsAmount)).toBeTruthy();
    });
  });

  describe('Testing if throws exception if invalid parameters is passed', () => {
    const useCases = new ExpenseUseCases();

    describe('Testing parameters of getExpensesValuesByYear method', () => {
      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.getExpensesValuesByYear(1, '2026')).toThrow();
      });
      test('Must throw TypeError if year is invalid', () => {
        expect(() => useCases.getExpensesValuesByYear('1', 2026)).toThrow();
        expect(() => useCases.getExpensesValuesByYear('1', '0202')).toThrow();
        expect(() => useCases.getExpensesValuesByYear('1', '10202')).toThrow();
      });
    });

    describe('Testing parameters of getExpensesByMonth method', () => {
      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.getExpensesByMonth(1, '2026-07-05')).toThrow();
      });
      test('Must throw TypeError if date is invalid', () => {
        expect(() => useCases.getExpensesByMonth('1', 2026)).toThrow();
        expect(() => useCases.getExpensesByMonth('1', '2026-13-05')).toThrow();
        expect(() => useCases.getExpensesByMonth('1', '2026-07-32')).toThrow();
        expect(() => useCases.getExpensesByMonth('1', '2026-7-5')).toThrow();
        expect(() => useCases.getExpensesByMonth('1', '26-07-05')).toThrow();
        expect(() => useCases.getExpensesByMonth('1', '999-07-05')).toThrow();
      });
    });

    describe('Testing parameters of createExpense method', () => {
      const validCreateExpense = {
        description: 'Expense',
        expenseType: 'Outros',
        date: '2026-07-05',
        value: 123456
      };

      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.createExpense(1, validCreateExpense)).toThrow();
      });
      test('Must throw TypeError if createExpense is invalid', () => {
        const invalidCreateExpense = {...validCreateExpense, extraProperty: ''};
        expect(() => useCases.createExpense('1', invalidCreateExpense)).toThrow();

        // short description
        const invalidCreateExpenseProperties = {...validCreateExpense};
        invalidCreateExpenseProperties.description = 'ans';
        expect(() => useCases.createExpense('1', invalidCreateExpense)).toThrow();

        // to long description
        for (let i = 0; i < 121; i++) {
          invalidCreateExpenseProperties.description += 'a';
        }
        expect(() => useCases.createExpense('1', invalidCreateExpense)).toThrow();

        // invalid expenseType
        invalidCreateExpense.description = validCreateExpense.description;
        invalidCreateExpense.expenseType = 123;
        expect(() => useCases.createExpense('1', invalidCreateExpense)).toThrow();

        // invalid date
        invalidCreateExpense.expenseType = validCreateExpense.expenseType;
        invalidCreateExpense.date = '26-07-05';
        expect(() => useCases.createExpense('1', invalidCreateExpense)).toThrow();

        // invalid value
        invalidCreateExpense.date = '2026-07-05';
        invalidCreateExpense.value = 1234.56;
        expect(() => useCases.createExpense('1', invalidCreateExpense)).toThrow();
        invalidCreateExpense.value = '123456';
        expect(() => useCases.createExpense('1', invalidCreateExpense)).toThrow();
      });
    });

    describe('Testing parameters of deleteExpense method', () => {
      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.deleteExpense(1, 'incomeID')).toThrow();
      });
      test('Must throw TypeError if expenseID is invalid', () => {
        expect(() => useCases.deleteExpense('budgeID', 1)).toThrow();
      });
    });
  });
})
