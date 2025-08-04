import { CustomNavData } from '../../models/custom-nav-data.dto';

export const navItems: CustomNavData[] = [
  {
    name: 'Bodegas',
    url: '/warehouses',
    iconComponent: { name: 'cil-home' },
    roles: ['admin'],
  },
  {
    name: 'Inventario', // Valor por defecto, se actualizará dinámicamente
    url: '/warehouse-inventories',
    iconComponent: { name: 'cil-puzzle' },
    roles: ['admin', 'tienda', 'bodega'],
    dynamicName: true, // Marca para actualización dinámica
  },
  {
    name: 'Transferencias',
    url: '/transfers',
    iconComponent: { name: 'cil-loop-circular' },
    roles: ['admin', 'bodega'],
    badge: {
      color: 'warning',
      text: '0', // Este número se actualizará dinámicamente
    },
  },
  {
    name: 'Devoluciones',
    url: '/inventory-returns',
    iconComponent: { name: 'cil-arrow-circle-left' },
    roles: ['admin', 'bodega'],
  },
  {
    name: 'Órdenes',
    url: '/orders',
    iconComponent: { name: 'cil-task' },
    roles: ['administrador', 'admin', 'bodega', 'tienda'],
  },
  {
    name: 'Gestión Tradicional',
    url: '/product-loans',
    iconComponent: { name: 'cil-basket' },
    roles: ['admin'],
  },

  {
    name: 'Wallet',
    url: '/wallet',
    iconComponent: { name: 'cil-credit-card' },
    roles: ['administrador', 'admin', 'tienda'],
  },
  {
    name: 'Retiros',
    url: '/withdrawal-requests',
    iconComponent: { name: 'cil-dollar' },
    roles: ['administrador', 'admin', 'tienda'],
  },
  {
    name: 'Balance',
    url: '/stores',
    iconComponent: { name: 'cil-chart' },
    roles: ['administrador', 'admin'],
  },
];
