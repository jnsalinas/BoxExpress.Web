import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/warehouses.component').then((m) => m.WarehousesComponent),
    data: {
      title: 'Bodegas',
    },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./detail/warehouse-detail.component').then(
        (m) => m.WarehouseDetailComponent
      ),
  },
];
