import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/product-loans-list/product-loans-list.component').then(
        (m) => m.ProductLoansListComponent
      ),
    data: {
      title: 'Gestión Tradicional',
    },
  },
]; 