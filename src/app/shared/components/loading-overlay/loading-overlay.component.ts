import { Component, Input } from '@angular/core';
import { SpinnerComponent } from '@coreui/angular';

@Component({
  selector: 'app-loading-overlay',
  imports: [SpinnerComponent],
  standalone: true,
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
})
export class LoadingOverlayComponent {
  @Input() isLoading = false;
  @Input() loadingText: string = 'Cargando...';
}
