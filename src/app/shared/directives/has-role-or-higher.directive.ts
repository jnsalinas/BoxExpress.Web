import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Directive({
  selector: '[hasRoleOrHigher]',
  standalone: true
})
export class HasRoleOrHigherDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set hasRoleOrHigher(role: string) {
    const hasPermission = this.authService.hasRoleOrHigher(role);

    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
} 