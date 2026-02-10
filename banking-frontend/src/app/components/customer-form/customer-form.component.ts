import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: false,
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  loading = false;
  error = '';
  success = '';
  showSuccessPopup = false;
  createdCustomerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formData = this.customerForm.value;

    this.customerService.createCustomer(formData).subscribe({
      next: (customer) => {
        this.success = `Customer "${customer.name}" created successfully!`;
        this.createdCustomerId = customer.customerId;
        this.showSuccessPopup = true;
        this.loading = false;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Extract error message from server response if available
        const serverError = err.error?.error || err.error?.message || err.message;
        this.error = serverError || 'Failed to create customer. Please try again.';
        this.loading = false;
        this.showSuccessPopup = false;
        this.cdr.detectChanges();
        console.error('Error creating customer:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  closeSuccessAndNavigate(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/customers']);
  }
}
