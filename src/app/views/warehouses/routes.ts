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
  {
    path: ':warehouseId/inventory/:inventoryItemId',
    loadComponent: () =>
      import('./inventory-item-detail/inventory-item-detail.component').then(
        (m) => m.InventoryItemDetailComponent
      ),
  },
];
