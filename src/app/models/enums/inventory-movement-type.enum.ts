export enum InventoryMovementType {
  OrderDelivered = 1,
  OrderCanceled = 2,
  TransferSent = 3,
  TransferReceived = 4,
  ManualAdjustment = 5,
  InitialLoad = 6,
  OrderDeliveryReverted = 7,
  InitialStock = 8,
}

export const InventoryMovementTypeText: Record<InventoryMovementType, string> =
  {
    [InventoryMovementType.OrderDelivered]: 'Orden entregada',
    [InventoryMovementType.OrderCanceled]: 'Orden cancelada',
    [InventoryMovementType.TransferSent]: 'Transferencia enviada',
    [InventoryMovementType.TransferReceived]: 'Transferencia recibida',
    [InventoryMovementType.ManualAdjustment]: 'Movimiento manual',
    [InventoryMovementType.InitialLoad]: 'Carga inicial',
    [InventoryMovementType.OrderDeliveryReverted]: 'Orden revertida',
    [InventoryMovementType.InitialStock]: 'Inicial stock',
  };
