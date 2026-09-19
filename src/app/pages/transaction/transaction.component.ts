
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Account {
  accountId: number;
  accountNumber: string;
  accountType: string;
  currency: string;
  currentBalance: number;
}

interface TransactionRequest {
  accountId: number;
  counterpartyAccount: string;
  counterpartyName: string;
  transactionType: string;
  amount: number;
  currency: string;
  transactionDatetime: string;
  countryCode: string;
  channel: string;
  merchantCategory: string;
  narration: string;
}

interface TransactionResponse {
  transactionId: number;
  accountId: number;
  transactionType: string;
  amount: number;
  currency: string;
  amountInr: number;
  transactionDatetime: string;
  countryCode: string;
  channel: string;
  status: string;
  isHighRisk: boolean;
}

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  private accountApi =
    'http://localhost:8082/sentinel/api/v1/accounts';

  private transactionApi =
    'http://localhost:8082/sentinel/api/v1/transactions';

  accounts: Account[] = [];

  loading = false;

  response: TransactionResponse | null = null;

  transaction: TransactionRequest = {
    accountId: 0,
    counterpartyAccount: '',
    counterpartyName: '',
    transactionType: '',
    amount: 0,
    currency: 'INR',
    transactionDatetime: '',
    countryCode: 'IN',
    channel: 'ONLINE',
    merchantCategory: '',
    narration: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {

    this.http.get<Account[]>(this.accountApi)
      .subscribe({
        next: (data) => {
          this.accounts = data;
        },

        error: (error) => {
          console.error('Failed to load accounts', error);
        }
      });
  }

  processTransaction(): void {

    this.loading = true;
    this.response = null;

    this.http.post<TransactionResponse>(
      this.transactionApi,
      this.transaction
    )
    .subscribe({

      next: (data) => {

        this.response = data;
        this.loading = false;

        console.log('Transaction response:', data);
      },

      error: (error) => {

        console.error('Transaction failed:', error);

        this.loading = false;

        alert(
          error?.error?.message ||
          'Transaction processing failed'
        );
      }
    });
  }
}
