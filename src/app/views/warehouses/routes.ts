import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./warehouses.component').then((m) => m.WarehousesComponent),
    data: {
      title: 'Bodegas',
    },
  },
];
