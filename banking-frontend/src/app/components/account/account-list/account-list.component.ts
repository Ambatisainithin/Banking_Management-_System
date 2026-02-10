import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: false,
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  loading = true;
  error = '';

  constructor(
    private accountService: AccountService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load accounts. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading accounts:', err);
      }
    });
  }

  viewAccount(id: number): void {
    this.router.navigate(['/accounts', id]);
  }

  editAccount(id: number): void {
    this.router.navigate(['/accounts', id, 'edit']);
  }

  deleteAccount(id: number): void {
    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      this.accountService.deleteAccount(id).subscribe({
        next: () => {
          this.accounts = this.accounts.filter(a => a.accountId !== id);
          this.error = ''; // Clear any previous errors
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error deleting account:', err);
          // Provide more specific error messages
          if (err.status === 500) {
            this.error = 'Cannot delete account. It may have associated transactions or dependencies.';
          } else if (err.status === 404) {
            this.error = 'Account not found. It may have already been deleted.';
            this.loadAccounts(); // Refresh the list
          } else if (err.error && (err.error.message || err.error.error)) {
            this.error = err.error.message || err.error.error;
          } else {
            this.error = 'Failed to delete account. Please try again.';
          }
          this.cdr.detectChanges();
        }
      });
    }
  }

  createAccount(): void {
    this.router.navigate(['/accounts/new']);
  }
}
