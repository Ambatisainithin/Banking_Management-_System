import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  // ✅ ADMIN BASE API
  private adminUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) {}

  // ================= GET =================

  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.adminUrl}/accounts`);
  }

  getAccountById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.adminUrl}/account/${id}`);
  }

  getAccountsByCustomerId(customerId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${environment.apiUrl}/api/customer/accounts/${customerId}`);
  }

  // ================= CREATE =================

  createAccount(data: any): Observable<Account> {
    const params = {
      customerId: data.customerId,
      branchId: data.branchId || 1,  // Default branch
      adminId: data.adminId || 1,    // Default admin
      accountNumber: data.accountNumber,
      type: data.accountType,
      balance: data.balance
    };
    return this.http.post<Account>(`${this.adminUrl}/open-account`, null, { params });
  }

  // ================= UPDATE =================

  updateAccount(id: number, data: any): Observable<Account> {
    const params: any = {};
    if (data.accountType) params.type = data.accountType;
    if (data.balance !== undefined) params.balance = data.balance;
    if (data.status) params.status = data.status;
    return this.http.put<Account>(`${this.adminUrl}/account/${id}`, null, { params });
  }

  // ================= DELETE =================
  // (Only works if backend endpoint exists)

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/account/${id}`);
  }

  // ================= CUSTOMER ACTIONS =================

  deposit(accountId: number, amount: number): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/customer/deposit?accountId=${accountId}&amount=${amount}`,
      {}
    );
  }

  withdraw(accountId: number, amount: number): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/customer/withdraw?accountId=${accountId}&amount=${amount}`,
      {}
    );
  }

}



