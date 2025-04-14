import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalBodyComponent,
  ModalFooterComponent,
  ButtonDirective,
  ButtonCloseDirective,
} from '@coreui/angular';

@Component({
  standalone: true,
  selector: 'app-generic-modal',
  imports: [
    CommonModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    ButtonDirective,
    ButtonCloseDirective,
  ],
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss'],
})
export class GenericModalComponent {
  @Input() title: string = ''; // Título del modal
  @Input() body: string = ''; // Contenido del modal
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal
  @Output() ok = new EventEmitter<void>(); // Evento para aceptar cambios

  private onOkCallback: (() => void) | null = null; // Callback de "Aceptar"
  private onCloseCallback: (() => void) | null = null; // Callback de "Cerrar"

  // Control de visibilidad del modal
  public isVisible: boolean = false;

  // Método para mostrar el modal
  show(config: { title?: string; body?: string; ok?: () => void; close?: () => void }) {
    this.title = config.title ?? ''; // Establece el título
    this.body = config.body ?? ''; // Establece el contenido
    this.onOkCallback = config.ok ?? null; // Establece la función para "Aceptar"
    this.onCloseCallback = config.close ?? null; // Establece la función para "Cerrar"
    this.isVisible = true;  // Abre el modal
  }

  // Método para ocultar el modal
  hide() {
    this.isVisible = false;  // Cierra el modal
  }

  // Método que se ejecuta al presionar "Cerrar"
  onClose() {
    this.onCloseCallback?.();  // Llama a la función de cierre si está definida
    this.close.emit(); // Emite el evento de cierre
    this.hide(); // Oculta el modal
  }

  // Método que se ejecuta al presionar "Aceptar"
  onOk() {
    this.onOkCallback?.(); // Llama a la función de "Aceptar" si está definida
    this.ok.emit(); // Emite el evento de "Aceptar"
    this.hide(); // Oculta el modal
  }
}
