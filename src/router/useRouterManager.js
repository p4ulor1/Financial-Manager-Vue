import { useRouter, useRoute } from "vue-router";

export default function useRouterManager() {
  const route  = useRoute();
  const router = useRouter();

  return {
    goToBudget:       () => router.push('/'),
    goToDashboard:    () => router.push('/dashboard'),
    goToIncome:       () => router.push('/income'),
    goToExpense:      () => router.push('/expense'),
    goToContribution: () => router.push('/contribution'),
    goToCreditCard:   () => router.push('/creditCard'),
  };
};
