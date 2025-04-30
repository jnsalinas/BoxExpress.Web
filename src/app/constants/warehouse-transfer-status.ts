export enum WarehouseTransferStatus {
    Pending = 0,
    Accepted = 1,
    Rejected = 2
  }
  
  export const WarehouseTransferStatusText: Record<WarehouseTransferStatus, string> = {
    [WarehouseTransferStatus.Pending]: 'Pendiente',
    [WarehouseTransferStatus.Accepted]: 'Aceptada',
    [WarehouseTransferStatus.Rejected]: 'Rechazada'
  };
  