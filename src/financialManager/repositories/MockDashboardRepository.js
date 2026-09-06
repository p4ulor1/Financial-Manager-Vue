import DashboardRepository from "@/financialManager/repositories/interfaces/DashboardRepository.js"

const PROMISE_RESOLVE_TIME = 250;

export default class MockDashboardRepository extends DashboardRepository {
  constructor(db) {
    super(db);
  }

  /**
   * @param {String} budgetID
   * @param {String} date - YYYY-MM-DD
   * @returns {Promise<Array<Number>>} - incomesValuesByYear
   */
  getIncomesValuesByYear(budgetID, date) {
    const MIN_INCOME_VALUE = 250000;
    const MAX_INCOME_VALUE = 400000;
    const incomesValues = [];

    for (let i = 0; i < 12; i++) {
      incomesValues.push(
        Number.parseInt((Math.random() * (MAX_INCOME_VALUE - MIN_INCOME_VALUE) + MIN_INCOME_VALUE).toString())
      );
    }

    return new Promise(res => {
      setTimeout(() => {
        res(incomesValues);
      }, PROMISE_RESOLVE_TIME)
    });
  }

  /**
   * @param {String} budgetID
   * @param {String} date - YYYY-MM-DD
   * @returns {Promise<Array<Number>>} - expensesValuesByYear
   */
  getExpensesValuesByYear(budgetID, date) {
    const MIN_VALUE = 25000;
    const MAX_VALUE = 100000;
    const values = [];

    for (let i = 0; i < 12; i++) {
      values.push(
        Number.parseInt((Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE).toString())
      );
    }

    return new Promise(res => {
      setTimeout(() => {
        res(values);
      }, PROMISE_RESOLVE_TIME);
    });
  }

  /**
   * @typedef {Object} CreditCard
   * @property {String} id
   * @property {String} owner - The length must be in range of [3 - 20]
   * @property {String} operator - The length must be in range of [4 - 20]
   * @property {String} last4CardNumbers - Must be 4 numbers
   * @property {Number} closeDay - An integer in range of [1, 31]
   * @property {Number} dueDay - An integer in range of [1, 31]
   *
   * @typedef {Object} CreditCardInvoices
   * @property {Object} creditCard
   * @property {Array<Number>} simulatedInvoicesValuesByYear
   * @property {Array<Number>} effectiveInvoicesValuesByYear
   *
   * @param {String} budgetID
   * @param {String} date - YYYY-MM-DD
   * @returns {Promise<Array<CreditCardInvoices>>} - creditCardInvoices
   */
  getCreditCardsInvoicesValueByYear(budgetID, date) {
    const MIN_INVOICE_VALUE = 30000;
    const MAX_INVOICE_VALUE = 70000;
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
    const CCs_YEAR_INVOICES_VALUES_BUILDER = (() => {
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
    });
    const CCs_YEAR_EFFECTIVE_INVOICES_BUILDER = (() => {
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
    });

    return new Promise(res => {
      setTimeout(() => {
        res(CREDIT_CARDS.map((creditCard, i) => {
          return {
            creditCard: creditCard,
            simulatedInvoicesValuesByYear: CCs_YEAR_INVOICES_VALUES_BUILDER()
              .filter(yearInvoices => yearInvoices.creditCardID === creditCard.id)[0]
              .invoiceValues,
            effectiveInvoicesValuesByYear: CCs_YEAR_EFFECTIVE_INVOICES_BUILDER()
              .filter(yearInvoices => yearInvoices.creditCardID === creditCard.id)[0]
              .invoicesValues.map(simulatedInvoices => simulatedInvoices.value)
          }
        }));
      }, PROMISE_RESOLVE_TIME);
    })
  }

  /**
   * @param {String} budgetID
   * @param {String} date - YYYY-MM-DD
   * @returns {Promise<Array<Number>>} - incomesValuesByYear
   */
  getContributionsValuesByYear(budgetID, date) {
    const MIN_VALUE = 10000;
    const MAX_VALUE = 50000;
    const values = [];

    for (let i = 0; i < 12; i++) {
      values.push(
        Number.parseInt((Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE).toString())
      );
    }

    return new Promise(res => {
      setTimeout(() => {
        res(values);
      }, PROMISE_RESOLVE_TIME);
    });
  }
}
