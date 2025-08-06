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
  {
    path: 'create',
    loadComponent: () =>
      import('./create/product-loan-create.component').then(
        (m) => m.ProductLoanCreateComponent
      ),
    data: {
      title: 'Crear Préstamo',
    },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./create/product-loan-create.component').then(
        (m) => m.ProductLoanCreateComponent
      ),
    data: {
      title: 'Editar Préstamo',
    },
  },
  {
    path: ':id/detail',
    loadComponent: () =>
      import('./detail/product-loan-detail.component').then(
        (m) => m.ProductLoanDetailComponent
      ),
    data: {
      title: 'Detalle de Préstamo',
    },
  },
]; 