import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { Account } from '../../../models/account.model';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-account-detail',
  standalone: false,
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  account: Account | null = null;
  transactions: Transaction[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAccount(+id);
      this.loadTransactions(+id);
    }
  }

  loadAccount(id: number): void {
    this.accountService.getAccountById(id).subscribe({
      next: (data) => {
        this.account = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load account details.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading account:', err);
      }
    });
  }

  loadTransactions(accountId: number): void {
    this.transactionService.getTransactionsByAccount(accountId).subscribe({
      next: (data: any) => {
        this.transactions = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading transactions:', err);
        this.cdr.detectChanges();
      }
    });
  }

  goToDeposit(): void {
    if (this.account) {
      this.router.navigate(['/accounts', this.account.accountId, 'deposit']);
    }
  }

  goToWithdraw(): void {
    if (this.account) {
      this.router.navigate(['/accounts', this.account.accountId, 'withdraw']);
    }
  }

  goToEdit(): void {
    if (this.account) {
      this.router.navigate(['/accounts', this.account.accountId, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/accounts']);
  }
}
