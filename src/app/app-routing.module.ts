import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { AlertsComponent } from './pages/alerts/alerts.component';
import { AllTransactionsComponent } from './pages/all-transactions/all-transactions.component';
import { LoginComponent } from './pages/login/login.component';

import { authGuard } from './guards/auth.guard';

const routes: Routes = [

  // Login - public
  {
    path: 'login',
    component: LoginComponent
  },

  // Protected routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'transaction',
    component: TransactionComponent,
    canActivate: [authGuard]
  },

  {
    path: 'alerts',
    component: AlertsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'all-transactions',
    component: AllTransactionsComponent,
    canActivate: [authGuard]
  },

  // Default route
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // Unknown route
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }