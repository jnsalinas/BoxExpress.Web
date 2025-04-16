import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletTransactionDto } from '../../../models/wallet-transaction.dto';
import { WalletTransactionService } from '../../../services/wallet-transaction.service';
import {
  RowComponent,
  ColComponent,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
} from '@coreui/angular';
import { E } from '@angular/animations/animation_player.d-D5d9jwCX';

@Component({
  selector: 'app-wallet-transaction-list',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    CommonModule
  ],
  templateUrl: './wallet-transaction-list.component.html',
  styleUrl: './wallet-transaction-list.component.scss',
})
export class WalletTransactionListComponent implements OnInit {
  transactions: WalletTransactionDto[] = [
    {
      id: 1,
      storeName: 'Tienda Centro',
      userName: 'Juan Pérez',
      description: 'Pago de orden',
      amount: 150000,
      relatedOrderId: 987
    },
    {
      id: 2,
      storeName: 'Sucursal Norte',
      userName: 'Ana Gómez',
      description: 'Abono',
      amount: 30000,
      relatedOrderId: 1
    }
  ];

  constructor(private walletTransactionService: WalletTransactionService) {}

  ngOnInit(): void {
    this.walletTransactionService.getAll().subscribe({
      next: (response) => {   
        this.transactions = response;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      },  
    });
  }
}
