import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-account-form',
  standalone: false,
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  accountForm!: FormGroup;
  customers: Customer[] = [];
  isEditMode = false;
  accountId: number | null = null;
  loading = false;
  loadingCustomers = true;
  error = '';
  success = '';

  accountTypes = ['SAVINGS', 'CURRENT'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCustomers();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.route.snapshot.url.some(segment => segment.path === 'edit')) {
      this.isEditMode = true;
      this.accountId = +id;
      this.loadAccount(+id);
    }
  }

  initForm(): void {
    this.accountForm = this.fb.group({
      accountNumber: ['', [Validators.required, Validators.minLength(10)]],
      accountType: ['SAVINGS', Validators.required],
      balance: [0, [Validators.required, Validators.min(0)]],
      customerId: [null, Validators.required]
    });
  }

  loadCustomers(): void {
    this.loadingCustomers = true;
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loadingCustomers = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.loadingCustomers = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAccount(id: number): void {
    this.loading = true;
    this.accountService.getAccountById(id).subscribe({
      next: (account) => {
        this.accountForm.patchValue({
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          balance: account.balance,
          customerId: account.customer?.customerId
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load account.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading account:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formData = this.accountForm.value;
    const accountData = {
      accountNumber: formData.accountNumber,
      accountType: formData.accountType,
      balance: formData.balance,
      customerId: formData.customerId
    };

    if (this.isEditMode && this.accountId) {
      this.accountService.updateAccount(this.accountId, accountData).subscribe({
        next: () => {
          this.success = 'Account updated successfully!';
          this.loading = false;
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/accounts']), 1500);
        },
        error: (err) => {
          this.error = 'Failed to update account.';
          this.loading = false;
          this.cdr.detectChanges();
          console.error('Error updating account:', err);
        }
      });
    } else {
      this.accountService.createAccount(accountData).subscribe({
        next: () => {
          this.success = 'Account created successfully!';
          this.loading = false;
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/accounts']), 1500);
        },
        error: (err) => {
          this.error = 'Failed to create account.';
          this.loading = false;
          this.cdr.detectChanges();
          console.error('Error creating account:', err);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/accounts']);
  }
}
