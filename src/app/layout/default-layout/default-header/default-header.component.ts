import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { navItems } from '../_nav';
import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  RowComponent,
  SidebarToggleDirective,
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../services/auth.service';
import { WalletService } from '../../../services/wallet.service';
import { StoreDto } from '../../../models/store.dto';
import { WarehouseInventoryTransferService } from '../../../services/warehouse-inventory-transfer.service';
import { NavBadgeService } from '../../../services/nav-badge.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  imports: [
    ContainerComponent,
    HeaderTogglerDirective,
    SidebarToggleDirective,
    IconDirective,
    HeaderNavComponent,
    NavItemComponent,
    NavLinkDirective,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    BreadcrumbRouterComponent,
    DropdownComponent,
    DropdownToggleDirective,
    AvatarComponent,
    DropdownMenuDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    BadgeComponent,
    DropdownDividerDirective,
    ColComponent,
    RowComponent,
    CommonModule,
  ],
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' },
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return (
      this.colorModes.find((mode) => mode.name === currentMode)?.icon ??
      'cilSun'
    );
  });

  store?: StoreDto;

  constructor(
    private authService: AuthService,
    private router: Router,
    private walletService: WalletService,
    private warehouseInventoryTransferService: WarehouseInventoryTransferService,
    private cdr: ChangeDetectorRef,
    private navBadgeService: NavBadgeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getBalanceInformation();
    this.getPendingTransfers();
  }

  getBalanceInformation() {
    if (
      this.authService.hasAnyRole(['tienda', 'admin']) &&
      this.authService.getToken()
    ) {
      this.walletService.summary().subscribe({
        next: (res) => {
          console.log(res);
          this.store = res;
        },
        error: (err) => {
          console.error('Error cargando balances', err);
        },
      });
    }
  }
  navItems = [...navItems];

  getPendingTransfers() {
    this.warehouseInventoryTransferService.getPendingTransfers({}).subscribe({
      next: (response) => {
        const count = response;
        console.log('count', count);
        this.navBadgeService.updatePendingTransfersCount(count);
      },
      error: (err) => {
        console.error('Error cargando transferencias', err);
      },
    });

    // const transferItem = navItems.find(
    //   (item) => item.name === 'Transferencias'
    // );
    // if (transferItem && transferItem.badge) {
    //   const count = 10;
    //   transferItem.badge.text = count.toString();
    //   transferItem.badge.color = count > 0 ? 'warning' : 'secondary';
    // }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
