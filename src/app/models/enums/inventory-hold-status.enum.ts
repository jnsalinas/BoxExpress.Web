export enum InventoryHoldStatus {
  Active = 1, // Retención activa: inventario reservado
  Released = 2, // No se usó inventario, se liberó la retención
  Consumed = 3, // Ya se consumió (ej: se envió producto)
  PendingReturn = 4, // Esperando confirmación de devolución (nuevo)
  Returned = 5, // Producto volvió a bodega
  NotReturned = 6, // Producto NO volvió (se pierde o daña)
}

export const InventoryHoldStatusText: Record<InventoryHoldStatus, string> = {
  [InventoryHoldStatus.Active]: 'Orden en gestion',
  [InventoryHoldStatus.Released]: 'Procesamiento cancelado',
  [InventoryHoldStatus.Consumed]: 'Procesamiento consumido',
  [InventoryHoldStatus.PendingReturn]: 'Pendiente por devolución',
  [InventoryHoldStatus.Returned]: 'Productos devueltos',
  [InventoryHoldStatus.NotReturned]: 'Productos no devueltos',
};
