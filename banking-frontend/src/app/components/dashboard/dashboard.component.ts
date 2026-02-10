import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Account } from '../../models/account.model';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
  
})
export class DashboardComponent implements OnInit {

  totalAccounts: number = 0;
  totalCustomers: number = 0;
  totalBalance: number = 0;
  loading: boolean = true;

  constructor(
    private accountService: AccountService,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Redirect customers to their dashboard
    if (this.authService.getUserType() === 'CUSTOMER') {
      this.router.navigate(['/customer-dashboard']);
      return;
    }
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    // ✅ LOAD ACCOUNTS
    this.accountService.getAllAccounts().subscribe({
      next: (accounts: Account[]) => {
        this.totalAccounts = accounts.length;
        this.totalBalance = accounts.reduce(
          (sum: number, acc: Account) => sum + Number(acc.balance),
          0
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error loading accounts:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    // ✅ LOAD CUSTOMERS
    this.customerService.getAllCustomers().subscribe({
      next: (customers: Customer[]) => {
        this.totalCustomers = customers.length;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error loading customers:', err);
        this.cdr.detectChanges();
      }
    });
  }
}



