import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppMessages } from '../resources/messages';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private toastr: ToastrService) {}

  showMessageError(message: string, title?: string): void {
    this.scrollToTop();
    this.toastr.error(message, title || 'Error');
  }

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

  private getMessageByKey(key: string, messageObject: any): string {
    const keys = key.split('.');
    let result = messageObject;

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key;
      }
    }

    return typeof result === 'string' ? result : key;
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
