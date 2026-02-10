import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  success: boolean;
  message: string;
  userType: string;
  userId: number;
  name: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/api/auth`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userTypeSubject = new BehaviorSubject<string | null>(this.getStoredUserType());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userType$ = this.userTypeSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('userId');
  }

  private getStoredUserType(): string | null {
    return localStorage.getItem('userType');
  }

  customerLogin(email: string, password: string): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);
    
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/customer/login`,
      null,
      { params }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.storeUserData(response);
        }
      })
    );
  }

  adminLogin(email: string, password: string): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);
    
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/admin/login`,
      null,
      { params }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.storeUserData(response);
        }
      })
    );
  }

  private storeUserData(response: LoginResponse): void {
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('userType', response.userType);
    localStorage.setItem('userName', response.name);
    if (response.email) {
      localStorage.setItem('userEmail', response.email);
    }
    this.isLoggedInSubject.next(true);
    this.userTypeSubject.next(response.userType);
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    this.isLoggedInSubject.next(false);
    this.userTypeSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id, 10) : null;
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
}
