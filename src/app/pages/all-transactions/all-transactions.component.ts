// all-transactions.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Transaction {
  transactionId: number;
  accountId: number;
  transactionType: string;
  amount: number;
  currency: string;
  amountInr: number;
  transactionDatetime: string;
  countryCode: string;
  channel: string;
  merchantCategory: string;
  counterpartyName: string;
  status: string;
  isHighRisk: boolean;
}

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class AllTransactionsComponent implements OnInit {

  transactions: Transaction[] = [];

  private apiUrl =
    'http://localhost:8082/sentinel/api/v1/all-transactions';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.http.get<Transaction[]>(this.apiUrl)
      .subscribe({
        next: (data) => {
          this.transactions = data;
        },
        error: (error) => {
          console.error('Failed to load transactions:', error);
        }
      });
  }
}