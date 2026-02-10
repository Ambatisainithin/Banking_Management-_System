import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';
import { NavbarComponent } from './components/navbar/navbar.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { AccountListComponent } from './components/account/account-list/account-list.component';
import { AccountDetailComponent } from './components/account/account-detail/account-detail.component';
import { AccountFormComponent } from './components/account/account-form/account-form.component';
import { TransactionFormComponent } from './components/transaction/transaction-form/transaction-form.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    CustomerDashboardComponent,
    CustomerComponent,
    CustomerFormComponent,
    AccountListComponent,
    AccountDetailComponent,
    AccountFormComponent,
    TransactionFormComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
