import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { Account } from '../../models/account.model';
import { Transaction } from '../../models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-customer-dashboard',
  standalone: false,
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {

  customerName: string = '';
  customerId: number | null = null;
  customerEmail: string = '';
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  transactions: Transaction[] = [];
  
  // Fund Transfer
  showTransferForm: boolean = false;
  transferToAccount: string = '';
  transferAmount: number = 0;
  transferPassword: string = '';
  transferMessage: string = '';
  transferError: string = '';
  transferLoading: boolean = false;
  transferSuccess: boolean = false;

  loading: boolean = true;
  error: string = '';

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.customerName = this.authService.getUserName() || 'Customer';
    this.customerId = this.authService.getUserId();
    this.customerEmail = this.authService.getUserEmail() || '';
    
    if (this.customerId) {
      this.loadCustomerAccounts();
    } else {
      this.error = 'Customer not found. Please login again.';
      this.loading = false;
    }
  }

  loadCustomerAccounts(): void {
    this.loading = true;
    this.error = '';
    
    this.http.get<Account[]>(`${environment.apiUrl}/api/customer/accounts/${this.customerId}`)
      .subscribe({
        next: (accounts) => {
          console.log('Accounts loaded:', accounts);
          this.accounts = accounts;
          if (accounts.length > 0) {
            this.selectAccount(accounts[0]);
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading accounts:', err);
          this.error = 'Failed to load accounts. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  selectAccount(account: Account): void {
    this.selectedAccount = account;
    this.loadTransactions(account.accountId);
    this.cdr.detectChanges();
  }

  loadTransactions(accountId: number): void {
    this.transactionService.getTransactionsByAccount(accountId).subscribe({
      next: (transactions) => {
        console.log('Transactions loaded:', transactions);
        this.transactions = transactions;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.cdr.detectChanges();
      }
    });
  }

  getTotalBalance(): number {
    return this.accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  }

  // Fund Transfer Methods
  openTransferForm(): void {
    this.showTransferForm = true;
    this.transferMessage = '';
    this.transferError = '';
  }

  closeTransferForm(): void {
    this.showTransferForm = false;
    this.transferToAccount = '';
    this.transferAmount = 0;
    this.transferPassword = '';
    this.transferMessage = '';
    this.transferError = '';
    this.transferLoading = false;
    this.transferSuccess = false;
  }

  submitTransfer(): void {
    if (!this.selectedAccount) {
      this.transferError = 'Please select an account first.';
      return;
    }

    if (!this.transferToAccount || this.transferAmount <= 0) {
      this.transferError = 'Please enter valid transfer details.';
      return;
    }

    if (this.transferAmount > this.selectedAccount.balance) {
      this.transferError = 'Insufficient balance for this transfer.';
      return;
    }

    if (!this.transferPassword) {
      this.transferError = 'Please enter your password to confirm transfer.';
      return;
    }

    this.transferLoading = true;
    this.transferError = '';

    // First verify password
    this.authService.customerLogin(this.customerEmail, this.transferPassword).subscribe({
      next: (response) => {
        if (response.success) {
          // Password verified, proceed with transfer
          this.executeTransfer();
        } else {
          this.transferError = 'Invalid password. Please try again.';
          this.transferLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Password verification error:', err);
        this.transferError = 'Invalid password. Please try again.';
        this.transferLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  executeTransfer(): void {
    // Check if input is a number (account ID) or account number
    const isNumeric = /^\d+$/.test(this.transferToAccount);
    
    console.log('Transfer initiated. To account:', this.transferToAccount, 'Is numeric:', isNumeric);
    
    if (isNumeric) {
      // It's an account ID, proceed directly
      this.performTransfer(parseInt(this.transferToAccount));
    } else {
      // It's an account number, look it up first
      const lookupUrl = `${environment.apiUrl}/api/customer/account-by-number/${this.transferToAccount}`;
      console.log('Looking up account at:', lookupUrl);
      
      this.http.get<Account>(lookupUrl)
        .subscribe({
          next: (account) => {
            console.log('Account lookup successful:', account);
            console.log('Account ID extracted:', account.accountId);
            this.performTransfer(account.accountId);
          },
          error: (err) => {
            console.error('Account lookup error:', err);
            const serverError = err.error?.error || err.error?.message || err.message;
            this.transferError = serverError || 'Account not found. Please check the account number.';
            this.transferLoading = false;
            this.cdr.detectChanges();
          }
        });
    }
  }

  performTransfer(toAccountId: number): void {
    console.log('Performing transfer from', this.selectedAccount!.accountId, 'to', toAccountId, 'amount:', this.transferAmount);
    
    this.transactionService.transfer(
      this.selectedAccount!.accountId,
      toAccountId,
      this.transferAmount
    ).subscribe({
      next: (response) => {
        console.log('Transfer successful! Response:', response);
        this.transferSuccess = true;
        this.transferMessage = `Successfully transferred $${this.transferAmount} to account ${this.transferToAccount}`;
        this.transferError = '';
        this.transferLoading = false;
        // Reload accounts and transactions
        this.loadCustomerAccounts();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Transfer error:', err);
        // Extract error message from server response if available
        const serverError = err.error?.error || err.error?.message || err.message;
        this.transferError = serverError || 'Transfer failed. Please check the account number and try again.';
        this.transferSuccess = false;
        this.transferLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Deposit
  deposit(amount: number): void {
    if (!this.selectedAccount || amount <= 0) return;

    this.transactionService.deposit(this.selectedAccount.accountId, amount).subscribe({
      next: () => {
        this.loadCustomerAccounts();
      },
      error: (err) => {
        console.error('Deposit error:', err);
      }
    });
  }

  // Withdraw
  withdraw(amount: number): void {
    if (!this.selectedAccount || amount <= 0) return;

    if (amount > this.selectedAccount.balance) {
      alert('Insufficient balance!');
      return;
    }

    this.transactionService.withdraw(this.selectedAccount.accountId, amount).subscribe({
      next: () => {
        this.loadCustomerAccounts();
      },
      error: (err) => {
        console.error('Withdrawal error:', err);
      }
    });
  }
}
