import { Customer } from './customer.model';

export interface Account {
  accountId: number;
  accountNumber: string;
  accountType: string;
  balance: number;
  status?: string;
  openedDate?: string;
  customer?: Customer;
}
