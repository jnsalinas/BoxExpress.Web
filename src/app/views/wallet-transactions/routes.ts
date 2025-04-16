import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/wallet-transaction-list.component').then(
        (m) => m.WalletTransactionListComponent
      ),
    data: {
      title: 'Transacciones de billetera',
    },
  },
  
];
