import { createRouter, createWebHistory } from 'vue-router';
import Layout1     from '@/layout/Layout-1.vue';
import Orcamentos  from '@/views/Orcamentos.vue';
import Dashboard   from '@/views/Dashboard.vue';
import Entrada     from '@/views/Entrada.vue';
import Aporte      from '@/views/Aporte.vue';
import Despesas    from '@/views/Despesas.vue';
import Cartao      from '@/views/Cartao.vue';
import Calculadora from '@/views/Calculadora.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout1,
      children: [
        {
          path: '/',
          name: 'budget',
          component: Orcamentos
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: '/income',
          name: 'income',
          component: Entrada
        },
        {
          path: '/contribution',
          name: 'contribution',
          component: Aporte
        },
        {
          path: '/expense',
          name: 'expense',
          component: Despesas
        },
        {
          path: '/creditCard',
          name: 'creditCard',
          component: Cartao
        },
        {
          path: '/calculator',
          name: 'calculator',
          component: Calculadora
        }
      ]
    }
  ]
});

export default router;
