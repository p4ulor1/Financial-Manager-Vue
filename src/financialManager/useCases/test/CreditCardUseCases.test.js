import CreditCardUseCases from '@/financialManager/useCases/CreditCardUseCases';
import MockCreditCardRepository from '@/financialManager/repositories/MockCreditCardRepository';

describe('Test CreditCardUseCases', () => {
  const dbMock = null;
  const budgetIDMock = 'budgetIDMock';

  describe('Testing the getter of credit cards informations, user defined invoices and invoices expenses of an year', async () => {
    const repo = new MockCreditCardRepository(dbMock);
    const spyRepo = vi.spyOn(repo, 'getCreditCardsInfosByYear');
    const creditCardUseCases = new CreditCardUseCases(repo);
    const presentDate = '2026-06-26';
    const creditCardsYearInfos = await creditCardUseCases.getCreditCardsInfosByYear(budgetIDMock, presentDate);
    const creditCardYearInfos = creditCardsYearInfos[0];

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call CreditCardRepository.getCreditCardsInfosByYear mock', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetIDMock, presentDate);
    });
    test('Must return an array of CreditCardYearInfos', () => {
      expect(creditCardsYearInfos).toBeInstanceOf(Array);
    });
    describe('Testing properties of a CreditCardYearInfos', () => {
      creditCardsYearInfos.forEach((creditCardYearInfos, i) => {
        test('Must contains the budgetID', () => {
          expect(creditCardYearInfos.budgetID).toBe(budgetIDMock);
        });
        test('Must contains an creditCard with infos', () => {
          expect(creditCardYearInfos.creditCard.id).toBeTypeOf('string');
          expect(creditCardYearInfos.creditCard.owner).toBeTypeOf('string');
          expect(creditCardYearInfos.creditCard.owner.length).toBeGreaterThanOrEqual(3);
          expect(creditCardYearInfos.creditCard.owner.length).toBeLessThanOrEqual(20);
          expect(creditCardYearInfos.creditCard.operator).toBeTypeOf('string');
          expect(creditCardYearInfos.creditCard.operator.length).toBeGreaterThanOrEqual(4);
          expect(creditCardYearInfos.creditCard.operator.length).toBeLessThanOrEqual(20);
          expect(creditCardYearInfos.creditCard.last4CardNumbers).toBeTypeOf('string');
          expect(creditCardYearInfos.creditCard.last4CardNumbers.length).toBe(4);
          expect(creditCardYearInfos.creditCard.closeDay).toBeTypeOf('number');
          expect(creditCardYearInfos.creditCard.closeDay).toBeGreaterThanOrEqual(1);
          expect(creditCardYearInfos.creditCard.closeDay).toBeLessThanOrEqual(31);
          expect(creditCardYearInfos.creditCard.dueDay).toBeTypeOf('number');
          expect(creditCardYearInfos.creditCard.dueDay).toBeGreaterThanOrEqual(1);
          expect(creditCardYearInfos.creditCard.dueDay).toBeLessThanOrEqual(31);
        });
        test('Must contains the invoices of an year (that is the sum of expenses of each month)', () => {
          expect(creditCardYearInfos.yearInvoices).toBeInstanceOf(Array);
          expect(creditCardYearInfos.yearInvoices).toHaveLength(12);
          creditCardYearInfos.yearInvoices.forEach((yearInvoice, i) => {
            expect(Number.isInteger(yearInvoice)).toBeTruthy('number');
          });
        });
        test('Must contains the effective invoices of year (that is the invoice value registred by user)', () => {
          expect(creditCardYearInfos.yearEffectiveInvoices).toBeInstanceOf(Array);
          expect(creditCardYearInfos.yearEffectiveInvoices).toHaveLength(12);
          creditCardYearInfos.yearEffectiveInvoices.forEach((yearEffectiveInvoice, i) => {
            expect(yearEffectiveInvoice.id).toBeTypeOf('string');
            expect(yearEffectiveInvoice.creditCardID).toBeTypeOf('string');
            expect(yearEffectiveInvoice.date).toBeTypeOf('string');
            expect(yearEffectiveInvoice.date).toMatch(`2026-${i < 9 ? `0${i+1}` : i+1}-00`);
            expect(Number.isInteger(yearEffectiveInvoice.value)).toBeTruthy();
          });

        });
        test('Must contains the sum of the last 12 months invoices values', () => {
          expect(Number.isInteger(creditCardYearInfos.last12MonthsAmount)).toBeTruthy();
        });
        test('Must contains the sum of the last 12 months effective invoices values', () => {
          expect(Number.isInteger(creditCardYearInfos.effectiveLast12MonthsAmount)).toBeTruthy();
        });
      });
    })
  });

  describe('Testing the getter of credit cards registred invoice expenses of a month', async () => {
    const repo = new MockCreditCardRepository(dbMock);
    const spyRepo = vi.spyOn(repo, 'getCreditCardsExpensesByMonth');
    const creditCardUseCases = new CreditCardUseCases(repo);
    const invoicesExpensesMonth = '2026-06-00';
    const creditCardsMonthExpenses = await creditCardUseCases.getCreditCardsExpensesByMonth(invoicesExpensesMonth);

    afterAll(() => {
      spyRepo.mockClear();
    });

    describe('Testing the direct CreditCardUseCases.getCreditCardsExpensesByMonth call result', () => {
      test('Must call CreditCardRepository.getCreditCardsExpensesByMonth', () => {
        expect(spyRepo).toHaveBeenCalledTimes(1);
        expect(spyRepo).toHaveBeenCalledWith(invoicesExpensesMonth);
      });
      test('Must return a array of CreditCardMonthExpenses', () => {
        expect(creditCardsMonthExpenses).toBeInstanceOf(Array);
      });
      describe('Testing each CreditCardMonthExpenses', () => {
        test('Must contains creditCardID', () => {
          creditCardsMonthExpenses.forEach((creditCardMonthExpenses, i) => {
            expect(creditCardMonthExpenses.creditCardID).toBeTypeOf('string');
          });
        });
        test('Must contains MonthExpenses', () => {
          creditCardsMonthExpenses.forEach((creditCardMonthExpenses, i) => {
            creditCardMonthExpenses.monthExpenses.forEach((expense, i) => {
              expect(expense.id).toBeTypeOf('string');
              expect(expense.description).toBeTypeOf('string');
              expect(expense.description.length).toBeGreaterThanOrEqual(4);
              expect(expense.description.length).toBeLessThanOrEqual(120);
              expect(expense.expenseType).toBeTypeOf('string');
              expect(expense.date).toBeTypeOf('string');
              expect(expense.date).toMatch(/\d{4}-\d{2}-\d{2}/);
              expect(expense.value).toBeTypeOf('number');
              expect(Number.isInteger(expense.value)).toBeTruthy();
            });
          });
        });
      });
    });
  });

  describe('Testing the editing of effective invoice', async () => {
    const repo = new MockCreditCardRepository(dbMock);
    const spyRepoUpdateEffectiveInvoice = vi.spyOn(repo, 'updateEffectiveInvoice');
    const spyRepoCreateEffectiveInvoice = vi.spyOn(repo, 'createEffectiveInvoice');
    const creditCardUseCases = new CreditCardUseCases(repo);
    const updateNonExistingEffectiveInvoice = {
      id: null,
      creditCardID: 'creditCardID',
      dueDate: '2026-06-00',
      value: 123456
    };
    const updateEffectiveInvoice = {
      id: 'effectiveInvoiceID',
      creditCardID: 'creditCardID',
      dueDate: '2026-06-00',
      value: 123456
    };
    const createdEffectiveInvoice = await creditCardUseCases.updateEffectiveInvoice(updateNonExistingEffectiveInvoice);
    const updatedEffectiveInvoice = await creditCardUseCases.updateEffectiveInvoice(updateEffectiveInvoice);

    afterAll(() => {
      spyRepoUpdateEffectiveInvoice.mockClear();
      spyRepoCreateEffectiveInvoice.mockClear();
    });

    describe('Teting a existing effective invoice', () => {
      test('Must call CreditCardRepository.updateEffectiveInvoice', () => {
        expect(spyRepoUpdateEffectiveInvoice).toHaveBeenCalledTimes(1);
        expect(spyRepoUpdateEffectiveInvoice).toHaveBeenCalledWith(updateEffectiveInvoice);
      });
      test('Must return UpdatedEffectiveInvoice', () => {
        expect(updatedEffectiveInvoice.id).toBeTypeOf('string');
        expect(updatedEffectiveInvoice.id).toEqual(updateEffectiveInvoice.id);
        expect(updatedEffectiveInvoice.creditCardID).toBeTypeOf('string');
        expect(updatedEffectiveInvoice.creditCardID).toEqual(updateEffectiveInvoice.creditCardID);
        expect(updatedEffectiveInvoice.dueDate).toBeTypeOf('string');
        expect(updatedEffectiveInvoice.dueDate).toMatch(/\d{4}-\d{2}-00/);
        expect(updatedEffectiveInvoice.dueDate).toEqual(updateEffectiveInvoice.dueDate);
        expect(Number.isInteger(updatedEffectiveInvoice.value)).toBeTruthy();
        expect(updatedEffectiveInvoice.value).toEqual(updateEffectiveInvoice.value);
      });
    });
    describe('Teting a non existing effective invoice', () => {
      test('Must call CreditCardRepository.createEffectiveInvoice', () => {
        expect(spyRepoCreateEffectiveInvoice).toHaveBeenCalledTimes(1);
        expect(spyRepoCreateEffectiveInvoice).toHaveBeenCalledWith({
          creditCardID: updateNonExistingEffectiveInvoice.creditCardID,
          dueDate: updateNonExistingEffectiveInvoice.dueDate,
          value: updateNonExistingEffectiveInvoice.value
        });
      });
      test('Must return a createdEffectiveInvoice', () => {
        expect(createdEffectiveInvoice.id).toBeTypeOf('string');
        expect(createdEffectiveInvoice.creditCardID).toBeTypeOf('string');
        expect(createdEffectiveInvoice.creditCardID).toEqual(updateNonExistingEffectiveInvoice.creditCardID);
        expect(createdEffectiveInvoice.dueDate).toBeTypeOf('string');
        expect(createdEffectiveInvoice.dueDate).toMatch(/\d{4}-\d{2}-00/);
        expect(createdEffectiveInvoice.dueDate).toEqual(updateNonExistingEffectiveInvoice.dueDate);
        expect(Number.isInteger(createdEffectiveInvoice.value)).toBeTruthy();
        expect(createdEffectiveInvoice.value).toEqual(updateNonExistingEffectiveInvoice.value);
      });
    });
  });

  describe('Testing the creating of effective invoice', async () => {
    const repo = new MockCreditCardRepository(dbMock);
    const spyRepoCreateEffectiveInvoice = vi.spyOn(repo, 'createEffectiveInvoice');
    const creditCardUseCases = new CreditCardUseCases(repo);
    const createEffectiveInvoice = {
      creditCardID: 'creditCardID',
      dueDate: '2026-06-00',
      value: 123456
    };
    const createdEffectiveInvoice = await creditCardUseCases.createEffectiveInvoice(createEffectiveInvoice);

    afterAll(() => {
      spyRepoCreateEffectiveInvoice.mockClear();
    });

    test('Must call CreditCardRepository.updateEffectiveInvoice', () => {
      expect(spyRepoCreateEffectiveInvoice).toHaveBeenCalledTimes(1);
      expect(spyRepoCreateEffectiveInvoice).toHaveBeenCalledWith(createEffectiveInvoice);
    });
    test('Must return UpdatedEffectiveInvoice', () => {
      expect(createdEffectiveInvoice.id).toBeTypeOf('string');
      expect(createdEffectiveInvoice.creditCardID).toBeTypeOf('string');
      expect(createdEffectiveInvoice.creditCardID).toEqual(createEffectiveInvoice.creditCardID);
      expect(createdEffectiveInvoice.dueDate).toBeTypeOf('string');
      expect(createdEffectiveInvoice.dueDate).toMatch(/\d{4}-\d{2}-00/);
      expect(createdEffectiveInvoice.dueDate).toEqual(createEffectiveInvoice.dueDate);
      expect(Number.isInteger(createdEffectiveInvoice.value)).toBeTruthy();
      expect(createdEffectiveInvoice.value).toEqual(createEffectiveInvoice.value);
    });
  });

  describe('Testing the creating of credit card', async () => {
    const repo = new MockCreditCardRepository(dbMock);
    const spyRepo = vi.spyOn(repo, 'createCreditCard');
    const creditCardUseCases = new CreditCardUseCases(repo);
    const created_at = '2026-06-28';
    const createCreditCard = {
      owner: 'owner 1',
      operator: 'operator 1',
      last4CardNumbers: '0123',
      closeDay: 5,
      dueDay: 10
    };
    const creditCardYearInfos = await creditCardUseCases.createCreditCard(budgetIDMock, created_at, createCreditCard);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call CreditCardRepository.createCreditCard', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetIDMock, created_at, createCreditCard);
    });
    describe('Testing properties of a CreditCardYearInfos', () => {
      test('Must contains the budgetID', () => {
        expect(creditCardYearInfos.budgetID).toBe(budgetIDMock);
      });
      test('Must contains an creditCard with infos', () => {
        expect(creditCardYearInfos.creditCard.id).toBeTypeOf('string');
        expect(creditCardYearInfos.creditCard.owner).toBeTypeOf('string');
        expect(creditCardYearInfos.creditCard.owner.length).toBeGreaterThanOrEqual(3);
        expect(creditCardYearInfos.creditCard.owner.length).toBeLessThanOrEqual(20);
        expect(creditCardYearInfos.creditCard.operator).toBeTypeOf('string');
        expect(creditCardYearInfos.creditCard.operator.length).toBeGreaterThanOrEqual(4);
        expect(creditCardYearInfos.creditCard.operator.length).toBeLessThanOrEqual(20);
        expect(creditCardYearInfos.creditCard.last4CardNumbers).toBeTypeOf('string');
        expect(creditCardYearInfos.creditCard.last4CardNumbers).toMatch(/\d{4}/);
        expect(creditCardYearInfos.creditCard.closeDay).toBeTypeOf('number');
        expect(creditCardYearInfos.creditCard.closeDay).toBeGreaterThanOrEqual(1);
        expect(creditCardYearInfos.creditCard.closeDay).toBeLessThanOrEqual(31);
        expect(creditCardYearInfos.creditCard.dueDay).toBeTypeOf('number');
        expect(creditCardYearInfos.creditCard.dueDay).toBeGreaterThanOrEqual(1);
        expect(creditCardYearInfos.creditCard.dueDay).toBeLessThanOrEqual(31);
      });
      test('Must contains the invoices of an year (that is an array where each element is the sum of expenses of month)', () => {
        expect(creditCardYearInfos.yearInvoices).toBeInstanceOf(Array);
        expect(creditCardYearInfos.yearInvoices).toHaveLength(12);
        creditCardYearInfos.yearInvoices.forEach((yearInvoice, i) => {
          expect(yearInvoice).toEqual(0);
        });
      });
      test('Must contains the effective invoices of year (that is the invoice value registred by user)', () => {
        expect(creditCardYearInfos.yearEffectiveInvoices).toBeInstanceOf(Array);
        expect(creditCardYearInfos.yearEffectiveInvoices).toHaveLength(12);
        creditCardYearInfos.yearEffectiveInvoices.forEach((yearEffectiveInvoice, i) => {
          expect(yearEffectiveInvoice.id).toBeNull();
          expect(yearEffectiveInvoice.creditCardID).toBeTypeOf('string');
          expect(yearEffectiveInvoice.date).toBeTypeOf('string');
          expect(yearEffectiveInvoice.date).toMatch(`2026-${i < 9 ? `0${i+1}` : i+1}-00`);
          expect(yearEffectiveInvoice.value).toEqual(0);
        });
      });
      test('Must contains the sum of the last 12 months invoices values', () => {
        expect(creditCardYearInfos.last12MonthsAmount).toEqual(0);
      });
      test('Must contains the sum of the last 12 months effective invoices values', () => {
        expect(creditCardYearInfos.effectiveLast12MonthsAmount).toEqual(0);
      });
    });
  });

  describe('Testing the creating credit card expense', async () => {
    const repo = new MockCreditCardRepository(dbMock);
    const spyRepo = vi.spyOn(repo, 'createCreditCardExpense');
    const creditCardUseCases = new CreditCardUseCases(repo);
    const createExpense = {
      creditCardID: '1',
      description: 'Some Expense',
      expenseType: 'Mercado',
      date: '2026-06-14',
      value: 1234
    };
    const createdCreditCardExpense = await creditCardUseCases.createCreditCardExpense(createExpense);

    test('Must call CreditCardRepository.createCreditCardExpense', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(createExpense);
    });
    test('Must return CreatedCreditCardExpense', () => {
      expect(createdCreditCardExpense.id).toBeTypeOf('string');
      expect(createdCreditCardExpense.creditCardID).toBeTypeOf('string');
      expect(createdCreditCardExpense.creditCardID).toEqual(createExpense.creditCardID);
      expect(createdCreditCardExpense.description).toBeTypeOf('string');
      expect(createdCreditCardExpense.description.length).toBeGreaterThanOrEqual(4);
      expect(createdCreditCardExpense.description.length).toBeLessThanOrEqual(120);
      expect(createdCreditCardExpense.expenseType).toBeTypeOf('string');
      expect(createdCreditCardExpense.expenseType).toEqual(createExpense.expenseType);
      expect(createdCreditCardExpense.date).toBeTypeOf('string');
      expect(createdCreditCardExpense.date).toEqual(createExpense.date);
      expect(Number.isInteger(createdCreditCardExpense.value)).toBeTruthy();
      expect(createdCreditCardExpense.value).toEqual(createExpense.value);
    });
  });

  describe('Testing the removing credit card expense', async () => {
    const repo = new MockCreditCardRepository(dbMock);
    const spyRepo = vi.spyOn(repo, 'deleteCreditCardExpense');
    const creditCardUseCases = new CreditCardUseCases(repo);
    const creditCardID = 'mockCreditCardID';
    const expenseID = 'mockExpenseID';
    const removedCreditCardExpense = await creditCardUseCases.deleteCreditCardExpense(creditCardID, expenseID);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call CreditCardRepository.deleteCreditCardExpense method', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(creditCardID, expenseID);
    });
    test('Must return CreditCardExpense', () => {
      expect(removedCreditCardExpense.id).toBeTypeOf('string');
      expect(removedCreditCardExpense.id).toEqual(expenseID);
      expect(removedCreditCardExpense.creditCardID).toBeTypeOf('string');
      expect(removedCreditCardExpense.creditCardID).toEqual(creditCardID);
      expect(removedCreditCardExpense.description).toBeTypeOf('string');
      expect(removedCreditCardExpense.expenseType).toBeTypeOf('string');
      expect(removedCreditCardExpense.date).toBeTypeOf('string');
      expect(removedCreditCardExpense.date).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(Number.isInteger(removedCreditCardExpense.value)).toBeTruthy();
    });
  });
});
