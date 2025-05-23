import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '../inventory-returns/inventory-return-list/inventory-return-list.component'
      ).then((m) => m.InventoryReturnListComponent),
    data: {
      title: 'Devoluciones',
    },
  },
];
