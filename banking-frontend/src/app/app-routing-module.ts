import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { AccountListComponent } from './components/account/account-list/account-list.component';
import { AccountDetailComponent } from './components/account/account-detail/account-detail.component';
import { AccountFormComponent } from './components/account/account-form/account-form.component';
import { TransactionFormComponent } from './components/transaction/transaction-form/transaction-form.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'customer-dashboard', component: CustomerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountListComponent, canActivate: [AuthGuard] },
  { path: 'accounts/new', component: AccountFormComponent, canActivate: [AuthGuard] },
  { path: 'accounts/:id', component: AccountDetailComponent, canActivate: [AuthGuard] },
  { path: 'accounts/:id/edit', component: AccountFormComponent, canActivate: [AuthGuard] },
  { path: 'accounts/:id/deposit', component: TransactionFormComponent, canActivate: [AuthGuard] },
  { path: 'accounts/:id/withdraw', component: TransactionFormComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomerComponent, canActivate: [AuthGuard] },
  { path: 'customers/new', component: CustomerFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
