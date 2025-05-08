import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../stores/list/store-balance-list/store-balance-list.component'
      ).then((m) => m.StoreBalanceListComponent),
    data: {
      title: 'Balance',
    },
  },
];
