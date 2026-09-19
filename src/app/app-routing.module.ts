
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { AlertsComponent } from './pages/alerts/alerts.component';

const routes: Routes = [

  {
    path: 'dashboard',
    component: DashboardComponent
  },

  {
    path: 'transaction',
    component: TransactionComponent
  },

  {
    path: 'alerts',
    component: AlertsComponent
  },

  // Default route
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
