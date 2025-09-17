export enum InventoryMovementType {
  OrderDelivered = 1,
  OrderCanceled = 2,
  TransferSent = 3,
  TransferReceived = 4,
  ManualAdjustment = 5,
  InitialLoad = 6,
  OrderDeliveryReverted = 7,
  InitialStock = 8,
  LostOnCancellation = 9,
  Loan = 10,
  LoanReturned = 11,
  LoanDelivered = 12,
  TransferStoreSent = 13,
  TransferStoreReceived = 14,
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
    [InventoryMovementType.LostOnCancellation]: 'Pérdida por cancelación de orden ',
    [InventoryMovementType.Loan]: 'Préstamo',
    [InventoryMovementType.LoanReturned]: 'Préstamo devuelto',
    [InventoryMovementType.LoanDelivered]: 'Préstamo entregado',
    [InventoryMovementType.TransferStoreSent]: 'Transferencia de tienda enviada',
    [InventoryMovementType.TransferStoreReceived]: 'Transferencia de tienda recibida',
  };
