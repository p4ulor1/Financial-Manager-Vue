import IncomeUseCases from '@/financialManager/useCases/IncomeUseCases';
import MockIncomeRepository from '@/financialManager/repositories/MockIncomeRepository';

describe('Testing IncomeUseCases class', () => {
  const budgetIDMock = 'mock';

  describe('Testing the getting incomes by year', async () => {
    const repo = new MockIncomeRepository(null);
    const useCases = new IncomeUseCases(repo);
    const spyRepo = vi.spyOn(repo, 'getIncomesValuesByYear');
    const year = '2026';
    const incomes = await useCases.getIncomesValuesByYear(budgetIDMock, year);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call IncomeRepository.getIncomesValuesByYear', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetIDMock, year);
    });
    test('Must return yearIncomesValues', () => {
      expect(incomes).toBeInstanceOf(Array);
      expect(incomes).toHaveLength(12);
      incomes.forEach((incomeValue, i) => {
        expect(Number.isInteger(incomeValue)).toBeTruthy();
      });
    });
  });

  describe('Testing the getting month incomes', async () => {
    const repo = new MockIncomeRepository(null);
    const useCases = new IncomeUseCases(repo);
    const spyRepo = vi.spyOn(repo, 'getIncomesByMonth');
    const date = '2026-07';
    const incomes = await useCases.getIncomesByMonth(budgetIDMock, date);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call IncomeRepository.getIncomesByMonth', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetIDMock, date);
    });
    test('Must return an array with incomes of month', () => {
      expect(incomes).toBeInstanceOf(Array);
      incomes.forEach((income, i) => {
        expect(income.id).toBeTypeOf('string');
        expect(income.description).toBeTypeOf('string');
        expect(income.description.length).toBeGreaterThanOrEqual(4);
        expect(income.description.length).toBeLessThanOrEqual(20);
        expect(income.incomeType).toBeTypeOf('string');
        expect(income.date).toMatch(/\d{4}-\d{2}-\d{2}/);
        expect(Number.isInteger(income.value)).toBeTruthy();
      });
    });
  });

  describe('Testing creating income', async () => {
    const repo = new MockIncomeRepository(null);
    const useCases = new IncomeUseCases(repo);
    const spyRepo = vi.spyOn(repo, 'createIncome');
    const createIncome = {
      description: 'create income',
      incomeType: 'Renda Trabalho',
      date: '2026-07-05',
      value: 123456
    };
    const income = await useCases.createIncome(budgetIDMock, createIncome);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call IncomeRepository.createIncome', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetIDMock, createIncome);
    });
    test('Must create and return the created income', () => {
      expect(income.id).toBeTypeOf('string');
      expect(income.description).toEqual(createIncome.description);
      expect(income.incomeType).toEqual(createIncome.incomeType);
      expect(income.date).toEqual(createIncome.date);
      expect(income.value).toEqual(createIncome.value);
    });
  });

  describe('Testing removing of income', async () => {
    const repo = new MockIncomeRepository(null);
    const useCases = new IncomeUseCases(repo);
    const spyRepo = vi.spyOn(repo, 'deleteIncome');
    const incomeIDMock = 'mock';
    const income = await useCases.deleteIncome(budgetIDMock, incomeIDMock);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call IncomeRepository.deleteIncome', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetIDMock, incomeIDMock);
    });
    test('Must delete the income and return the removed income', () => {
      expect(income.id).toEqual(incomeIDMock);
      expect(income.description).toBeTypeOf('string');
      expect(income.incomeType).toBeTypeOf('string');
      expect(income.date).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(Number.isInteger(income.value)).toBeTruthy();
    });
  });

  describe('Testing the getting of last 12 months amount',async () => {
    const repo = new MockIncomeRepository(null);
    const useCases = new IncomeUseCases(repo);
    const spyRepo = vi.spyOn(repo, 'getLast12MonthsAmount');
    const currentDate = '2026-07';
    const sumOfIncomes = await useCases.getLast12MonthsAmount(budgetIDMock, currentDate);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call IncomeRepository.createIncome', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetIDMock, currentDate);
    });
    test('Must return the sum of last 12 months incomes', () => {
      expect(Number.isInteger(sumOfIncomes)).toBeTruthy();
    });
  });

  describe('Testing if throws exception if invalid parameters is passed', () => {
    const useCases = new IncomeUseCases();

    describe('Testing parameters of getIncomesValuesByYear method', () => {
      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.getIncomesValuesByYear(1, '2026')).toThrow();
      });
      test('Must throw TypeError if year is invalid', () => {
        expect(() => useCases.getIncomesValuesByYear('1', 2026)).toThrow();
        expect(() => useCases.getIncomesValuesByYear('1', '0202')).toThrow();
        expect(() => useCases.getIncomesValuesByYear('1', '10202')).toThrow();
      });
    });

    describe('Testing parameters of getIncomesByMonth method', () => {
      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.getIncomesByMonth(1, '2026-07-05')).toThrow();
      });
      test('Must throw TypeError if date is invalid', () => {
        expect(() => useCases.getIncomesByMonth('1', 2026)).toThrow();
        expect(() => useCases.getIncomesByMonth('1', '2026-13-05')).toThrow();
        expect(() => useCases.getIncomesByMonth('1', '2026-07-32')).toThrow();
        expect(() => useCases.getIncomesByMonth('1', '2026-7-5')).toThrow();
        expect(() => useCases.getIncomesByMonth('1', '26-07-05')).toThrow();
        expect(() => useCases.getIncomesByMonth('1', '999-07-05')).toThrow();
      });
    });

    describe('Testing parameters of createIncome method', () => {
      const validCreatIncome = {
        description: 'Income',
        incomeType: 'Renda Trabalho',
        date: '2026-07-05',
        value: 123456
      };

      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.createIncome(1, validCreatIncome)).toThrow();
      });
      test('Must throw TypeError if createIncome is invalid', () => {
        const invalidCreateIncome = {...validCreatIncome, extraProperty: ''};
        expect(() => useCases.createIncome('1', invalidCreateIncome)).toThrow();

        // short description
        const invalidCreateIncomeProperties = {...validCreatIncome};
        invalidCreateIncomeProperties.description = 'ans';
        expect(() => useCases.createIncome('1', invalidCreateIncome)).toThrow();

        // to long description
        for (let i = 0; i < 121; i++) {
          invalidCreateIncomeProperties.description += 'a';
        }
        expect(() => useCases.createIncome('1', invalidCreateIncome)).toThrow();

        // invalid incomeType
        invalidCreateIncome.description = validCreatIncome.description;
        invalidCreateIncome.incomeType = 123;
        expect(() => useCases.createIncome('1', invalidCreateIncome)).toThrow();

        // invalid date
        invalidCreateIncome.incomeType = 'Renda Trabalho';
        invalidCreateIncome.date = '26-07-05';
        expect(() => useCases.createIncome('1', invalidCreateIncome)).toThrow();

        // invalid value
        invalidCreateIncome.date = '2026-07-05';
        invalidCreateIncome.value = 1234.56;
        expect(() => useCases.createIncome('1', invalidCreateIncome)).toThrow();
        invalidCreateIncome.value = '123456';
        expect(() => useCases.createIncome('1', invalidCreateIncome)).toThrow();
      });
    });

    describe('Testing parameters of deleteIncome method', () => {
      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.deleteIncome(1, 'incomeID')).toThrow();
      });
      test('Must throw TypeError if incomeID is invalid', () => {
        expect(() => useCases.deleteIncome('budgeID', 1)).toThrow();
      });
    });
  });
});
