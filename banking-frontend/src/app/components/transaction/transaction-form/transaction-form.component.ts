import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { Account } from '../../../models/account.model';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-transaction-form',
  standalone: false,
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  transactionForm!: FormGroup;
  account: Account | null = null;
  transactionType: 'deposit' | 'withdraw' = 'deposit';
  loading = false;
  loadingAccount = true;
  error = '';
  success = '';

  // Transaction modes/purposes
  depositModes = ['CASH', 'CHEQUE', 'TRANSFER', 'ONLINE'];
  withdrawModes = ['CASH', 'ATM', 'TRANSFER', 'ONLINE'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.route.snapshot.url;
    
    if (url.some(segment => segment.path === 'withdraw')) {
      this.transactionType = 'withdraw';
    }

    this.initForm();

    if (id) {
      this.loadAccount(+id);
    }
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      transactionMode: ['CASH'],  // Default to CASH
      description: [''],  // Optional
      transactionDate: [today],
      referenceNumber: ['']
    });
  }

  get availableModes(): string[] {
    return this.transactionType === 'deposit' ? this.depositModes : this.withdrawModes;
  }

  loadAccount(id: number): void {
    this.accountService.getAccountById(id).pipe(
      timeout(10000),
      catchError(err => {
        console.error('Error loading account:', err);
        this.error = err.name === 'TimeoutError' 
          ? 'Request timed out. Please check if the backend server is running on port 8080.'
          : 'Failed to load account. Please check your connection.';
        this.loadingAccount = false;
        return of(null);
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          this.account = data;
          this.loadingAccount = false;
          
          if (this.transactionType === 'withdraw') {
            this.transactionForm.get('amount')?.addValidators(Validators.max(data.balance));
            this.transactionForm.get('amount')?.updateValueAndValidity();
          }
        }
      }
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid || !this.account) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formData = this.transactionForm.value;
    const amount = formData.amount;

    if (this.transactionType === 'deposit') {
      this.accountService.deposit(this.account.accountId, amount).subscribe({
        next: () => {
          this.success = `Successfully deposited ${this.formatCurrency(amount)}!`;
          this.loading = false;
          setTimeout(() => this.router.navigate(['/accounts', this.account?.accountId]), 1500);
        },
        error: (err) => {
          console.error('Error during deposit:', err);
          if (err.error && (err.error.message || err.error.error)) {
            this.error = err.error.message || err.error.error;
          } else {
            this.error = 'Failed to complete deposit. Please try again.';
          }
          this.loading = false;
        }
      });
    } else {
      this.accountService.withdraw(this.account.accountId, amount).subscribe({
        next: () => {
          this.success = `Successfully withdrew ${this.formatCurrency(amount)}!`;
          this.loading = false;
          setTimeout(() => this.router.navigate(['/accounts', this.account?.accountId]), 1500);
        },
        error: (err) => {
          console.error('Error during withdrawal:', err);
          if (err.error && (err.error.message || err.error.error)) {
            this.error = err.error.message || err.error.error;
          } else {
            this.error = 'Failed to complete withdrawal. Please check your balance.';
          }
          this.loading = false;
        }
      });
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  goBack(): void {
    if (this.account) {
      this.router.navigate(['/accounts', this.account.accountId]);
    } else {
      this.router.navigate(['/accounts']);
    }
  }
}
