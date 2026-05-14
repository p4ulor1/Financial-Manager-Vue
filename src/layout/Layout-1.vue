<script setup>
  import { ref, watch, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import useRouterManager from '@/router/useRouterManager';
  import SelectDateModal from '@/components/SelectDateModal.vue';

  // router
  const routerManager = useRouterManager();
  const route         = useRoute();
  // end
  // dom
  const dashboard       = ref(null);
  const income          = ref(null);
  const expense         = ref(null);
  const creditCard      = ref(null);
  const contribution    = ref(null);
  const calculator      = ref(null);
  const scrollWrapper   = ref(null);
  const selectDateModal = ref(null);
  // end
  // utils
  const sectionTitle = ref('');
  let   activeIcon   = null;
  // end

  onMounted(() => {
    watch(() => route.name, (newRoute) => {
      if(activeIcon) activeIcon.classList.toggle('active');

      switch (newRoute) {
        case "budget":
          sectionTitle.value = 'Orçamentos';
          activeIcon = null;
          break;

        case "dashboard":
          sectionTitle.value = 'Resumo';
          activeIcon = dashboard.value;
          dashboard.value.classList.toggle('active');
          break;

        case "income":
          sectionTitle.value = "Entradas"
          activeIcon = income.value;
          income.value.classList.toggle('active');
          break;

        case "expense":
          sectionTitle.value = "Despesas"
          activeIcon = expense.value;
          expense.value.classList.toggle('active');
          break;

        case "contribution":
          sectionTitle.value = "Aportes"
          activeIcon = contribution.value;
          contribution.value.classList.toggle('active');
          break;

        case "creditCard":
          sectionTitle.value = "Cartões de Crédito"
          activeIcon = creditCard.value;
          creditCard.value.classList.toggle('active');
          break;

        case "calculator":
          sectionTitle.value = "Calculadoras"
          activeIcon = calculator.value;
          calculator.value.classList.toggle('active');
          break;
      }
    }, { immediate: true });
  });

  function toggleSidebar() {
    document.querySelector('.layout-container').classList.toggle('open-sidebar');
  }

  function changeRoute(changeRouterFunction) {
    if (route.name === "budget") return;

    scrollWrapper.value.scroll({top: 0})

    document.querySelector('.layout-container').classList.remove('open-sidebar');

    changeRouterFunction();
  }
</script>

<template>
  <div class="layout-container">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <a class="brand">
        <i class="bi bi-cash-stack brand-logo"></i>
        <h1 class="brand-label brand-label">App Finanças</h1>
      </a>

      <ul class="menu">
        <li ref="dashboard">
          <a class="menu-item" @click="changeRoute(routerManager.goToDashboard)">
            <i class="bi bi-columns-gap menu-icon"></i>
            <span class="menu-label">Dashboard</span>
          </a>
        </li>
        <li ref="income">
          <a class="menu-item" @click="changeRoute(routerManager.goToIncome)">
            <i class="bi bi-cash-stack menu-icon"></i>
            <span class="menu-label">Entrada</span>
          </a>
        </li>
        <li ref="expense">
          <a class="menu-item" @click="changeRoute(routerManager.goToExpense)">
            <i class="bi bi-receipt-cutoff menu-icon"></i>
            <span class="menu-label">Despesa</span>
          </a>
        </li>
        <li ref="creditCard">
          <a class="menu-item" @click="changeRoute(routerManager.goToCreditCard)">
            <i class="bi bi-credit-card-2-back menu-icon"></i>
            <span class="menu-label">Cartao de Credito</span>
          </a>
        </li>
        <li ref="contribution">
          <a class="menu-item" @click="changeRoute(routerManager.goToContribution)">
            <i class="bi bi-piggy-bank menu-icon"></i>
            <span class="menu-label">Aporte</span>
          </a>
        </li>
        <li ref="calculator">
          <a class="menu-item" @click="changeRoute(routerManager.goToCalculator)">
            <i class="bi bi-calculator menu-icon"></i>
            <span class="menu-label">Calculadora</span>
          </a>
        </li>
      </ul>
    </aside>

    <!-- BODY WRAPPER -->
    <div class="main-container">
      <header>
        <div
          class="sidebar-toggler"
          @click="toggleSidebar"
        >
          <div></div>
        </div>
        <div class="sidebar-toggler-fix"></div>

        <h4 class="section-title text-center">{{ sectionTitle }}</h4>

        <div class="balance" @click="selectDateModal.show()">
          <p class="text-center mb-1">Data</p>
          <p>**date here**</p>
        </div>
      </header>

      <main ref="scrollWrapper">
        <router-view v-slot="{ Component }">
          <Transition mode="out-in" appear>
            <component :is="Component"></component>
          </Transition>
        </router-view>

        <SelectDateModal ref="selectDateModal"
        ></SelectDateModal>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/scss/layout-1/index.scss";

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.25s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
