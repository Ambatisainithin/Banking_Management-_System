import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  private baseUrl = `${environment.apiUrl}/api/customer`;
  private adminUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  createCustomer(data: any): Observable<Customer> {
    const body = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      password: data.password
    };
    return this.http.post<Customer>(`${this.adminUrl}/customer`, body);
  }

  updateCustomer(id: number, customer: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.adminUrl}/customer/${id}`, { responseType: 'text' });
  }
}



