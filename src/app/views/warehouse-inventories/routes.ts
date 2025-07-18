import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/warehouse-inventories.component').then(
        (m) => m.WarehouseInventoriesComponent
      ),
    data: {
      title: 'Inventario de Bodegas',
    },
  },
]; 