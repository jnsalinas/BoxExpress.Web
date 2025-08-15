import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { Subscription } from 'rxjs';

import { IconDirective, IconModule } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
  INavData,
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { freeSet } from '@coreui/icons';
import { AuthService } from '../../services/auth.service';
import { CustomNavData } from '../../models/custom-nav-data.dto';
import { NavBadgeService } from '../../services/nav-badge.service';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective,
    IconModule,
    AsyncPipe,
  ],
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  icons = freeSet;
  public navItems = [...navItems];
  private subscription = new Subscription();

  constructor(
    private auth: AuthService,
    private navBadgeService: NavBadgeService,
    private cdr: ChangeDetectorRef
  ) {
    const role = this.auth.role;
    this.navItems = this.filterNavByRole(navItems, role ?? '');

    // Actualizar el nombre del menú de inventario si el usuario es bodega
    if (this.auth.isBodega()) {
      this.navItems = this.navItems.map((item) => {
        if (item.name === 'Inventario') {
          return {
            ...item,
            name: this.getWarehouseMenuName(),
          };
        }
        return item;
      });
    }
  }

  // Función que se ejecuta dinámicamente
  getWarehouseMenuName(): string {
    const role = localStorage.getItem('auth_role');
    if (role === 'bodega') {
      const warehouseName = localStorage.getItem('warehouseName');
      return warehouseName || 'Inventario';
    }
    return 'Inventario';
  }

  ngOnInit() {
    // Suscribirse a los cambios del contador de transferencias pendientes
    this.subscription.add(
      this.navBadgeService.pendingTransfersCount$.subscribe((count) => {
        console.log('navBadgeService - count', count);
        this.updateNavItems(count);
      })
    );
  }

  private updateNavItems(pendingCount: number) {
    console.log('Actualizando navItems con count:', pendingCount);
    const transferItem = this.navItems.find(
      (item) => item.name === 'Transferencias'
    );
    if (transferItem) {
      if (!transferItem.badge) {
        transferItem.badge = { color: 'warning', text: '0' };
      }
      transferItem.badge.text = pendingCount.toString();
      transferItem.badge.color = pendingCount > 0 ? 'warning' : 'secondary';
      console.log('Badge actualizado:', transferItem.badge);

      // Crear nueva referencia del array para forzar la detección de cambios
      this.navItems = [...this.navItems];

      // Forzar la detección de cambios
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterNavByRole(navItems: any[], userRole: string): CustomNavData[] {
    return navItems
      .filter((item) => !item.roles || item.roles.includes(userRole))
      .map((item) => {
        if (item.children) {
          return {
            ...item,
            children: this.filterNavByRole(item.children, userRole),
          };
        }
        return item;
      })
      .filter((item) => !item.children || item.children.length > 0);
  }
}
