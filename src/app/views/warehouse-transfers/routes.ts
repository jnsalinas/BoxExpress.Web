import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../warehouse-transfers/warehouse-transfers-list/warehouse-transfers-list.component').then(
        (m) => m.WarehouseTransfersListComponent
      ),
    data: {
      title: 'Transferencia de inventarios',
    },
  },
];
