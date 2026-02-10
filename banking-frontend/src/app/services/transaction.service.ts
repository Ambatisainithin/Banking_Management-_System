import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  // backend base path
  private baseUrl = `${environment.apiUrl}/api/customer`;

  constructor(private http: HttpClient) {}

  // =============================
  // GET TRANSACTIONS BY ACCOUNT
  // =============================
  getTransactionsByAccount(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/transactions/${accountId}`
    );
  }

  // =============================
  // DEPOSIT
  // =============================
  deposit(accountId: number, amount: number): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.baseUrl}/deposit?accountId=${accountId}&amount=${amount}`,
      {}
    );
  }

  // =============================
  // WITHDRAW
  // =============================
  withdraw(accountId: number, amount: number): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.baseUrl}/withdraw?accountId=${accountId}&amount=${amount}`,
      {}
    );
  }

  // =============================
  // TRANSFER
  // =============================
  transfer(fromAccountId: number, toAccountId: number, amount: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/transfer?fromAccountId=${fromAccountId}&toAccountId=${toAccountId}&amount=${amount}`,
      {}
    );
  }

  // =============================
  // CREATE TRANSACTION (USED BY FORM)
  // =============================
  createTransaction(data: any): Observable<any> {

    // choose type and route to backend
    if (data.type === 'DEPOSIT') {
      return this.deposit(data.accountId, data.amount);
    }

    if (data.type === 'WITHDRAW') {
      return this.withdraw(data.accountId, data.amount);
    }

    if (data.type === 'TRANSFER') {
      return this.transfer(
        data.fromAccountId,
        data.toAccountId,
        data.amount
      );
    }

    throw new Error('Invalid transaction type');
  }
}



