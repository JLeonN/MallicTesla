import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'inicio',
        component: () => import('@/pages/IndexPage.vue'),
      },
      {
        path: 'presupuestos',
        name: 'presupuestos',
        component: () => import('@/components/PaginaModuloPendiente.vue'),
        props: {
          titulo: 'Presupuestos',
          descripcion: 'Acá vas a consultar y administrar todos tus presupuestos.',
          icono: 'request_quote',
        },
      },
      {
        path: 'presupuestos/nuevo',
        name: 'nuevo-presupuesto',
        component: () => import('@/components/PaginaModuloPendiente.vue'),
        props: {
          titulo: 'Nuevo presupuesto',
          descripcion: 'El formulario se incorporará en el próximo módulo funcional.',
          icono: 'add_circle',
        },
      },
      {
        path: 'clientes',
        name: 'clientes',
        component: () => import('@/components/PaginaModuloPendiente.vue'),
        props: {
          titulo: 'Clientes',
          descripcion: 'Acá vas a organizar los datos de cada cliente.',
          icono: 'groups',
        },
      },
      {
        path: 'materiales',
        name: 'materiales',
        component: () => import('@/components/PaginaModuloPendiente.vue'),
        props: {
          titulo: 'Materiales',
          descripcion: 'Acá vas a mantener tu catálogo de materiales y precios.',
          icono: 'inventory_2',
        },
      },
      {
        path: 'historial',
        name: 'historial',
        component: () => import('@/components/PaginaModuloPendiente.vue'),
        props: {
          titulo: 'Historial',
          descripcion: 'Acá vas a consultar trabajos y presupuestos anteriores.',
          icono: 'history',
        },
      },
      {
        path: 'configuracion',
        name: 'configuracion',
        component: () => import('@/components/PaginaModuloPendiente.vue'),
        props: {
          titulo: 'Configuración',
          descripcion: 'Acá vas a personalizar los datos y preferencias de Mallic Tesla.',
          icono: 'settings',
        },
      },
      {
        path: 'mas',
        name: 'mas',
        component: () => import('@/pages/MasPage.vue'),
      },
    ],
  },

  { path: '/:catchAll(.*)*', redirect: '/' },
];

export default routes;
