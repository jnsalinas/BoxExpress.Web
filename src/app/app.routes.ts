import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { RoleGuard } from './guards/role.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'warehouses',
        loadChildren: () =>
          import('./views/warehouses/routes').then((m) => m.routes),
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'admin'] },
      },
      {
        path: 'transfers',
        loadChildren: () =>
          import('./views/warehouse-transfers/routes').then((m) => m.routes),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'bodega'] },
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./views/orders/routes').then((m) => m.routes),
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'admin', 'bodega', 'tienda'] },
      },
      {
        path: 'inventory-returns',
        loadChildren: () =>
          import('./views/inventory-returns/routes').then((m) => m.routes),
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'admin', 'bodega'] },
      },
      {
        path: 'wallet',
        loadChildren: () =>
          import('./views/wallet-transactions/routes').then((m) => m.routes),
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'admin', 'tienda'] },
      },
      {
        path: 'withdrawal-requests',
        loadChildren: () =>
          import('./views/withdrawal-requests/routes').then((m) => m.routes),
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'admin', 'tienda'] },
      },
      {
        path: 'stores',
        loadChildren: () =>
          import('./views/stores/routes').then((m) => m.routes),
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'admin', 'tienda'] },
      },
      {
        path: 'warehouse-inventories',
        loadChildren: () =>
          import('./views/warehouse-inventories/routes').then((m) => m.routes),
        canActivate: [RoleGuard],
        data: { roles: ['administrador', 'admin', 'bodega', 'tienda'] },
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/routes').then((m) => m.routes),
      },
      // {
      //   path: 'theme',
      //   loadChildren: () =>
      //     import('./views/theme/routes').then((m) => m.routes),
      // },
      // {
      //   path: 'base',
      //   loadChildren: () => import('./views/base/routes').then((m) => m.routes),
      // },
      // {
      //   path: 'buttons',
      //   loadChildren: () =>
      //     import('./views/buttons/routes').then((m) => m.routes),
      // },
      // {
      //   path: 'forms',
      //   loadChildren: () =>
      //     import('./views/forms/routes').then((m) => m.routes),
      // },
      // {
      //   path: 'icons',
      //   loadChildren: () =>
      //     import('./views/icons/routes').then((m) => m.routes),
      // },
      // {
      //   path: 'notifications',
      //   loadChildren: () =>
      //     import('./views/notifications/routes').then((m) => m.routes),
      // },
      // {
      //   path: 'widgets',
      //   loadChildren: () =>
      //     import('./views/widgets/routes').then((m) => m.routes),
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () =>
      //     import('./views/charts/routes').then((m) => m.routes),
      // },
      // {
      //   path: 'pages',
      //   loadChildren: () =>
      //     import('./views/pages/routes').then((m) => m.routes),
      // },
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then(
        (m) => m.Page404Component
      ),
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then(
        (m) => m.Page500Component
      ),
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./views/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [LoginGuard],
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    data: {
      title: 'Register Page',
    },
  },
  { path: '**', redirectTo: 'dashboard' },
];
