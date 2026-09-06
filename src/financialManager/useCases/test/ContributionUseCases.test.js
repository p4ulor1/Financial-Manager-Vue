import ContributionUseCases from "@/financialManager/useCases/ContributionUseCases";
import IncomeUseCases from "@/financialManager/useCases/IncomeUseCases";
import MockIncomeRepository from '@/financialManager/repositories/MockIncomeRepository';
import MockContributionRepository from '@/financialManager/repositories/MockContributionRepository';

describe('Testing ContributionUseCases', () => {
  const budgetID = 'mock';

  describe('Testing getContributionsValuesByYear method', async () => {
    const repo = new MockContributionRepository(null);
    const spyRepo = vi.spyOn(repo, 'getContributionsValuesByYear');
    const useCase = new ContributionUseCases(repo);
    const year = '2026';
    const contributionsValues = await useCase.getContributionsValuesByYear(budgetID, year);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call ContributionRepository.getContributionsValuesByYear', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetID, year);
    });
    test('Must return an array of integers', () => {
      expect(contributionsValues).toBeInstanceOf(Array);
      expect(contributionsValues).toHaveLength(12);
      contributionsValues.forEach(contributionValue => {
        expect(Number.isInteger(contributionValue)).toBeTruthy();
      });
    });
  });

  describe('Testing getContributionsByMonth', async () => {
    const repo = new MockContributionRepository(null);
    const spyRepo = vi.spyOn(repo, 'getContributionsByMonth');
    const useCase = new ContributionUseCases(repo);
    const monthDate = '2026-07';
    const contributions = await useCase.getContributionsByMonth(budgetID, monthDate);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call ContributionRepository.getContributionsByMonth', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetID, monthDate);
    });
    test('Must return an array of contributions', () => {
      expect(contributions).toBeInstanceOf(Array);
      contributions.forEach(contribution => {
        expect(contribution.id).toBeTypeOf('string');
        expect(contribution.description).toBeTypeOf('string');
        expect(contribution.date).toBeTypeOf('string');
        expect(Number.isInteger(contribution.value)).toBeTruthy();
      });
    });
  });

  describe('Testing createContribution', async () => {
    const repo = new MockContributionRepository(null);
    const spyRepo = vi.spyOn(repo, 'createContribution');
    const useCase = new ContributionUseCases(repo);
    const createContribution = {
      description: 'Contribution',
      date: '2026-07-06',
      value: 123456
    };
    const createdContribution = await useCase.createContribution(budgetID, createContribution);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call ContributionRepository.createContribution', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetID, createContribution);
    });
    test('Must return the created Expense', () => {
      expect(createdContribution.id).toBeTypeOf('string');
      expect(createdContribution.description).toEqual(createContribution.description);
      expect(createdContribution.expenseType).toEqual(createContribution.expenseType);
      expect(createdContribution.date).toEqual(createContribution.date);
      expect(createdContribution.value).toEqual(createContribution.value);
    });
  });

  describe('Testing deleteContribution', async () => {
    const repo = new MockContributionRepository(null);
    const spyRepo = vi.spyOn(repo, 'deleteContribution');
    const useCase = new ContributionUseCases(repo);
    const contributionID = 'id_01';
    const deletedContribution = await useCase.deleteContribution(budgetID, contributionID);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call ContributionRepository.deleteContribution', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetID, contributionID);
    });
    test('Must return the deleted expense', () => {
      expect(deletedContribution.id).toEqual(contributionID);
      expect(deletedContribution.description).toBeTypeOf('string');
      expect(deletedContribution.date).toBeTypeOf('string');
      expect(Number.isInteger(deletedContribution.value)).toBeTruthy();
    });
  });

  describe('Testing getLast12MonthsAmount', async () => {
    const repo = new MockContributionRepository(null);
    const spyRepo = vi.spyOn(repo, 'getLast12MonthsAmount');
    const useCase = new ContributionUseCases(repo);
    const currentDate = '2026-07';
    const last12MonthsAmount = await useCase.getLast12MonthsAmount(budgetID, currentDate);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call ContributionRepository.getLast12MonthsAmount', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetID, currentDate);
    });
    test('Must return the sum of last 12 months', () => {
      expect(Number.isInteger(last12MonthsAmount)).toBeTruthy();
    });
  });

  describe('Testing getTotalContributions', async () => {
    const repo = new MockContributionRepository(null);
    const spyRepo = vi.spyOn(repo, 'getTotalContributions');
    const useCase = new ContributionUseCases(repo);
    const totalContribution = await useCase.getTotalContributions(budgetID);

    afterAll(() => {
      spyRepo.mockClear();
    });

    test('Must call ContributionRepository.getTotalContributions', () => {
      expect(spyRepo).toHaveBeenCalledTimes(1);
      expect(spyRepo).toHaveBeenCalledWith(budgetID);
    });
    test('Must return the total of contributions values', () => {
      expect(Number.isInteger(totalContribution)).toBeTruthy();
    })
  });

  describe('Testing redeemContribution', async () => {
    const repo = new MockContributionRepository(null);
    const spyRedeemContribution = vi.spyOn(repo, 'redeemContribution');
    const spyCreateIncome = vi.spyOn(IncomeUseCases.prototype, 'createIncome');
    const useCase = new ContributionUseCases(repo);
    const contributionID = 'contributionIDMock'
    const redeemedDate = '2026-07-11';
    const incomeRepository = new MockIncomeRepository(null);
    const redeemedContribution = await useCase.redeemContribution(budgetID, contributionID, redeemedDate, incomeRepository);

    afterAll(() => {
      spyRedeemContribution.mockClear();
      spyCreateIncome.mockClear();
    });

    test('Must call ContributionRepository.redeemContribution', () => {
      expect(spyRedeemContribution).toHaveBeenCalledTimes(1);
      expect(spyRedeemContribution).toHaveBeenCalledWith(budgetID, contributionID, redeemedDate);
    });
    test('Must call IncomeUseCases.createIncome', () => {
      expect(spyCreateIncome).toHaveBeenCalledTimes(1);
      expect(spyCreateIncome).toHaveBeenCalledWith(budgetID, {
        description: "Redeemed Contribution",
        incomeType: "Resgate de Investimento",
        date: redeemedDate,
        value: 123456
      });
    });
    test('Must return a redeemed contribution as income', () => {
      expect(redeemedContribution.id).toBeTypeOf('string');
      expect(redeemedContribution.description).toEqual('Redeemed Contribution');
      expect(redeemedContribution.incomeType).toEqual('Resgate de Investimento');
      expect(redeemedContribution.date).toEqual(redeemedDate);
      expect(redeemedContribution.value).toEqual(123456);
    });
  });

  describe('Testing if throws exception if invalid parameters is passed', () => {
    const useCases = new ContributionUseCases();

    describe('Testing parameters of getContributionsValuesByYear method', () => {
      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.getContributionsValuesByYear(1, '2026')).toThrow();
      });
      test('Must throw TypeError if year is invalid', () => {
        expect(() => useCases.getContributionsValuesByYear('1', 2026)).toThrow();
        expect(() => useCases.getContributionsValuesByYear('1', '0202')).toThrow();
        expect(() => useCases.getContributionsValuesByYear('1', '10202')).toThrow();
      });
    });

    describe('Testing parameters of getContributionsByMonth method', () => {
      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.getContributionsByMonth(1, '2026-07-05')).toThrow();
      });
      test('Must throw TypeError if date is invalid', () => {
        expect(() => useCases.getContributionsByMonth('1', 2026)).toThrow();
        expect(() => useCases.getContributionsByMonth('1', '2026-13-05')).toThrow();
        expect(() => useCases.getContributionsByMonth('1', '2026-07-32')).toThrow();
        expect(() => useCases.getContributionsByMonth('1', '2026-7-5')).toThrow();
        expect(() => useCases.getContributionsByMonth('1', '26-07-05')).toThrow();
        expect(() => useCases.getContributionsByMonth('1', '999-07-05')).toThrow();
      });
    });

    describe('Testing parameters of createContribution method', () => {
      const validCreateContribution = {
        description: 'Contribution',
        date: '2026-07-05',
        value: 123456
      };

      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.createContribution(1, validCreateContribution)).toThrow();
      });
      test('Must throw TypeError if createContribution is invalid', () => {
        const invalidCreateContribution = {...validCreateContribution, extraProperty: ''};
        expect(() => useCases.createContribution('1', invalidCreateContribution)).toThrow();

        // short description
        const invalidCreateIncomeProperties = {...validCreateContribution};
        invalidCreateIncomeProperties.description = 'ans';
        expect(() => useCases.createContribution('1', invalidCreateContribution)).toThrow();

        // to long description
        for (let i = 0; i < 121; i++) {
          invalidCreateIncomeProperties.description += 'a';
        }
        expect(() => useCases.createContribution('1', invalidCreateContribution)).toThrow();

        // invalid date
        invalidCreateContribution.description = validCreateContribution.description;
        invalidCreateContribution.date = '26-07-05';
        expect(() => useCases.createContribution('1', invalidCreateContribution)).toThrow();

        // invalid value
        invalidCreateContribution.date = validCreateContribution.date;
        invalidCreateContribution.value = 1234.56;
        expect(() => useCases.createContribution('1', invalidCreateContribution)).toThrow();
        invalidCreateContribution.value = '123456';
        expect(() => useCases.createContribution('1', invalidCreateContribution)).toThrow();
      });
    });

    describe('Testing parameters of deleteContribution method', () => {
      test('Must throw TypeError if budgetID is invalid type', () => {
        expect(() => useCases.deleteContribution(1, 'incomeID')).toThrow();
      });
      test('Must throw TypeError if incomeID is invalid', () => {
        expect(() => useCases.deleteContribution('budgeID', 1)).toThrow();
      });
    });
  });
});
