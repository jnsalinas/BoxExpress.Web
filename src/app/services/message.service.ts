import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppMessages } from '../resources/messages';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private toastr: ToastrService) {}

  showError(messageKey: string, title?: string): void {
    const message = this.getMessageByKey(messageKey, AppMessages.errors);
    this.toastr.error(message, title || 'Error');
  }

  showSuccess(messageKey: string, title?: string): void {
    const message = this.getMessageByKey(messageKey, AppMessages.success);
    this.toastr.success(message, title || 'Éxito');
  }

  showInfo(messageKey: string, title?: string): void {
    const message = this.getMessageByKey(messageKey, AppMessages.info);
    this.toastr.info(message, title || 'Información');
  }

  showWarning(messageKey: string, title?: string): void {
    const message = this.getMessageByKey(messageKey, AppMessages.warning);
    this.toastr.warning(message, title || 'Advertencia');
  }

  // Método auxiliar para recuperar el mensaje según la clave
  private getMessageByKey(key: string, messageObject: any): string {
    const keys = key.split('.');
    let result = messageObject;

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key; // Si no se encuentra el mensaje, devuelve la clave
      }
    }

    return typeof result === 'string' ? result : key;
  }
}
