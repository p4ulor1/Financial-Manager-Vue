import CreditCardRepository from '@/financialManager/repositories/interfaces/CreditCardRepository';
import { parseISODate } from '@/vueUtils/dateUtils';

const PROMISE_RESOLVE_TIME = 1000;
const MIN_INVOICE_VALUE = 50000;
const MAX_INVOICE_VALUE = 150000;
const CREDIT_CARDS = (function () {
  const creditCards = []

  for (let i = 1; i < 4; i++) {
    const creditCard = {
      id: `ccID_${i}`,
      owner: `Owner ${i}`,
      operator: `Operator ${i}`,
      last4CardNumbers: Number.parseInt((Math.random() * (9999 - 1000) + 1000).toString()).toString(),
      closeDay: 5,
      dueDay: 10
    }

    creditCards.push(creditCard);
  }

  return creditCards;
})();
const CCs_YEAR_INVOICES_VALUES = (() => {
  const cc_invoices_values = [];

  CREDIT_CARDS.forEach((creditCard) => {
    const cc_invoice_values = {
      creditCardID: creditCard.id,
      invoiceValues: []
    };

    for (let j = 0; j < 12; j++) {
      cc_invoice_values.invoiceValues.push(
        Number.parseInt((Math.random() * (MAX_INVOICE_VALUE - MIN_INVOICE_VALUE) + MIN_INVOICE_VALUE).toString())
      );
    }

    cc_invoices_values.push(cc_invoice_values);
  });

  return cc_invoices_values;
})();
const CCs_YEAR_EFFECTIVE_INVOICES_VALUES = (() => {
  const ccs_effective_invoices_values = [];

  CREDIT_CARDS.forEach((creditCard, index) => {
    const cc_invoices_values = {
      creditCardID: creditCard.id,
      invoicesValues: []
    };

    for (let j = 0; j < 12; j++) {
      cc_invoices_values.invoicesValues.push({
        id: `monthEffectiveInvoiceID_${index}${j}`,
        creditCardID: creditCard.id,
        date: `2026-${j < 9 ? `0${j + 1}` : j + 1}-00`,
        value: Number.parseInt((Math.random() * (MAX_INVOICE_VALUE - MIN_INVOICE_VALUE) + MIN_INVOICE_VALUE).toString())
      });
    }

    ccs_effective_invoices_values.push(cc_invoices_values);
  });

  return ccs_effective_invoices_values;
})();

export default class MockCreditCardRepository extends CreditCardRepository {
  constructor(db) {
    super(null);
  }

  getCreditCardsInfosByYear(budgetID, presentDate) {
    const parsedDate = parseISODate(presentDate);
    const month = parsedDate.month;
    const creditCardsYearInfos = [];

    CREDIT_CARDS.forEach((_creditCard, i) => {
      creditCardsYearInfos.push({
        creditCard: {..._creditCard},
        budgetID: budgetID,
        yearInvoices: [...CCs_YEAR_INVOICES_VALUES[i].invoiceValues], // Shallow copy
        yearEffectiveInvoices: [...CCs_YEAR_EFFECTIVE_INVOICES_VALUES[i].invoicesValues] // Shallow copy
      });
    });

    return new Promise(res => {
      setTimeout(() => {
        res(creditCardsYearInfos);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  getCreditCardsExpensesByMonth(budgetID, date) {
    const month = parseISODate(date).month;
    const creditCardsMonthExpenses = [];

    CCs_YEAR_INVOICES_VALUES.forEach((ccYearInvoicesValue, i) => {
      const creditCardMonthExpenses = {
        creditCardID: ccYearInvoicesValue.creditCardID,
        monthExpenses: []
      };
      const numberOfExpenses = Number.parseInt((Math.random() * (7 - 4) + 4).toString());
      const eachExpenseValue = Number.parseInt(Math.round(ccYearInvoicesValue.invoiceValues[month - 1] / numberOfExpenses).toString());

      for (let i = 0; i < numberOfExpenses; i++) {
        creditCardMonthExpenses.monthExpenses.push({
          id: `id_00${i}`,
          description: `Despesa de Cartão ${i}`,
          expenseType: 'Outros',
          date: date,
          value: eachExpenseValue
        });
      }

      creditCardsMonthExpenses.push(creditCardMonthExpenses);
    });

    return new Promise(res => {
      setTimeout(() => {
        res(creditCardsMonthExpenses);
      }, PROMISE_RESOLVE_TIME)
    });
  }
  getCreditCardExpensesByMonth(budgetID, creditCardID, date) {
    const creditCardYearInvoicesValues = CCs_YEAR_INVOICES_VALUES.filter(creditCard => {
      return creditCard.creditCardID === creditCardID;
    })[0];
    const numberOfExpenses = Number.parseInt((Math.random() * (7 - 4) + 4).toString());
    const month = parseISODate(date).month;
    const eachExpenseValue = Number.parseInt(Math.round(
      creditCardYearInvoicesValues.invoiceValues[month - 1] / numberOfExpenses
    ).toString());
    const monthExpenses = []

    for (let i = 0; i < numberOfExpenses; i++) {
      monthExpenses.push({
        id: `id_00${i}`,
        description: `Despesa de Cartão ${i}`,
        expenseType: 'Outros',
        date: date,
        value: eachExpenseValue
      });
    }

    return new Promise(res => {
      setTimeout(() => {
        res(monthExpenses);
      }, PROMISE_RESOLVE_TIME)
    });
  }
  createCreditCard(budgetID, created_at, creditCard) {
    const year = parseISODate(created_at).year;
    const yearEffectiveInvoicesValues = [];
    const creditCardID = Date.now().toString();

    for (let i = 1; i < 13; i++) {
      yearEffectiveInvoicesValues.push({
        id: null,
        creditCardID: creditCardID,
        date: `${year}-${i < 10 ? `0${i}` : i}-00`,
        value: 0
      });
    }

    const creditCardYearInfos = {
      budgetID: budgetID,
      creditCard: {id: creditCardID, ...creditCard},
      yearInvoices: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      yearEffectiveInvoices: yearEffectiveInvoicesValues,
    };

    return new Promise(res => {
      setTimeout(() => {
        res(creditCardYearInfos);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  updateEffectiveInvoice(updateEffectiveInvoice) {
    return new Promise(res => {
      setTimeout(() => {
        res(updateEffectiveInvoice);
      }, PROMISE_RESOLVE_TIME);
    });
  }
  createEffectiveInvoice(createEffectiveInvoice) {
    return new Promise(res => {
      setTimeout(() => {
        res({id: Date.now().toString(), ...createEffectiveInvoice});
      }, PROMISE_RESOLVE_TIME);
    });
  }
  createCreditCardExpense(createCreditCardExpense) {
    return new Promise(res => {
      setTimeout(() => {
        res({id: Date.now().toString(), ...createCreditCardExpense});
      }, PROMISE_RESOLVE_TIME);
    });
  }
  deleteCreditCardExpense(creditCardID, expenseID) {
    return new Promise(res => {
      setTimeout(() => {
        res({
          id: expenseID,
          creditCardID: creditCardID,
          description: 'mockDescription',
          expenseType: 'mockType',
          date: '0000-00-00',
          value: 0
        });
      }, PROMISE_RESOLVE_TIME);
    });
  }
}
