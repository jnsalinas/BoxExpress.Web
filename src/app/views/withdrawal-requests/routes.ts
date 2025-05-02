import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../withdrawal-requests/list/withdrawal-request-list/withdrawal-request-list.component'
      ).then((m) => m.WithdrawalRequestListComponent),
    data: {
      title: 'Retiros',
    },
  },
];
