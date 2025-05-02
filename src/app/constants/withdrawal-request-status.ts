export enum WithdrawalRequestStatus {
    Pending = 0,
    Accepted = 1,
    Rejected = 2
  }
  
  export const WithdrawalRequestStatusText: Record<WithdrawalRequestStatus, string> = {
    [WithdrawalRequestStatus.Pending]: 'Pendiente',
    [WithdrawalRequestStatus.Accepted]: 'Aceptada',
    [WithdrawalRequestStatus.Rejected]: 'Rechazada'
  };
  