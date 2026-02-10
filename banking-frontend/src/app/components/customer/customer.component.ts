import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;
  error = '';

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load customers.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading customers:', err);
      }
    });
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.customerId !== id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Failed to delete customer.';
          this.cdr.detectChanges();
          console.error('Error deleting customer:', err);
        }
      });
    }
  }

  createCustomer(): void {
    this.router.navigate(['/customers/new']);
  }
}
