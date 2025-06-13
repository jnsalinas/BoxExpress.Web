import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

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
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { freeSet } from '@coreui/icons';
import { AuthService } from '../../services/auth.service';
import { CustomNavData } from '../../models/custom-nav-data.dto';

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
  ],
})
export class DefaultLayoutComponent {
  icons = freeSet;
  public navItems = [...navItems];
  constructor(private auth: AuthService) {
    console.log(freeSet);
    const role = this.auth.role; // O this.auth.roles si es array
    this.navItems = this.filterNavByRole(navItems, role ?? '');
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
