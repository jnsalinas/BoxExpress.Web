import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../orders/list/order-list.component').then(
        (m) => m.OrderListComponent
      ),
    data: {
      title: 'Ordenes',
    },
  },
  {
    path: 'create',
    loadComponent: () =>
      import('../orders/create/order-create.component').then(
        (m) => m.OrderCreateComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('../orders/detail/order-detail.component').then(
        (m) => m.OrderDetailComponent
      ),
  },
];
