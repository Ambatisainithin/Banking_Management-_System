import { Account } from './account.model';

export interface Transaction {
  transactionId: number;
  transactionType: string;
  transactionMode?: string;
  amount: number;
  status?: string;
  description?: string;
  referenceNumber?: string;
  transactionDate?: Date;
  account?: Account;
}
