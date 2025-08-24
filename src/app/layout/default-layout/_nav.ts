import { CustomNavData } from '../../models/custom-nav-data.dto';

export const navItems: CustomNavData[] = [
  {
    name: 'Bodegas',
    url: '/warehouses',
    iconComponent: { name: 'cil-home' },
    roles: ['admin', 'supervisor'],
  },
  {
    name: 'Inventario', // Valor por defecto, se actualizará dinámicamente
    url: '/warehouse-inventories',
    iconComponent: { name: 'cil-puzzle' },
    roles: ['admin', 'supervisor', 'tienda', 'bodega'],
    dynamicName: true, // Marca para actualización dinámica
  },
  {
    name: 'Transferencias',
    url: '/transfers',
    iconComponent: { name: 'cil-loop-circular' },
    roles: ['admin', 'supervisor', 'bodega'],
    badge: {
      color: 'warning',
      text: '0', // Este número se actualizará dinámicamente
    },
  },
  {
    name: 'Devoluciones',
    url: '/inventory-returns',
    iconComponent: { name: 'cil-arrow-circle-left' },
    roles: ['admin', 'supervisor', 'bodega'],
  },
  {
    name: 'Órdenes',
    url: '/orders',
    iconComponent: { name: 'cil-task' },
    roles: ['admin', 'supervisor', 'bodega', 'tienda'],
  },
  {
    name: 'Gestión Tradicional',
    url: '/product-loans',
    iconComponent: { name: 'cil-basket' },
    roles: ['admin', 'supervisor'],
  },

  {
    name: 'Wallet',
    url: '/wallet',
    iconComponent: { name: 'cil-credit-card' },
    roles: ['admin', 'supervisor', 'tienda'],
  },
  {
    name: 'Retiros',
    url: '/withdrawal-requests',
    iconComponent: { name: 'cil-dollar' },
    roles: ['admin', 'supervisor', 'tienda'],
  },
  {
    name: 'Balance',
    url: '/stores',
    iconComponent: { name: 'cil-chart' },
    roles: ['admin', 'supervisor', 'tienda'],
  },
];
