import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Alert {
alertId: number;
customerId: number | null;
accountId: number | null;
transactionId: number | null;
ruleCode: string | null;
ruleName: string | null;
riskScore: number | null;
alertStatus: string | null;
alertReason: string | null;
triggeredAt: string | null;
createdBy: string | null;
}

@Component({
selector: 'app-alerts',
templateUrl: './alerts.component.html',
styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

private readonly apiUrl = 'http://localhost:8082/sentinel/api/v1/alerts';

alerts: Alert[] = [];
filteredAlerts: Alert[] = [];

loading = false;
error = '';

searchText = '';
statusFilter = 'ALL';
riskFilter = 'ALL';

constructor(private http: HttpClient) {}

ngOnInit(): void {
this.loadAlerts();
}

loadAlerts(): void {

this.loading = true;
this.error = '';

this.http.get<Alert[]>(this.apiUrl).subscribe({

  next: (data: Alert[]) => {

    this.alerts = data || [];

    this.applyFilters();

    this.loading = false;
  },

  error: (err) => {

    console.error('Error loading alerts:', err);

    this.error =
      'Unable to connect to the alerts service. Please check that the backend is running.';

    this.loading = false;

  }

});


}

applyFilters(): void {

const search = this.searchText
  .trim()
  .toLowerCase();

this.filteredAlerts = this.alerts.filter((alert: Alert) => {

  /*
   * SEARCH
   */
  const matchesSearch =
    !search ||
    this.getSearchText(alert).includes(search);

  /*
   * STATUS
   */
  const matchesStatus =
    this.statusFilter === 'ALL' ||
    (alert.alertStatus || '').toUpperCase() === this.statusFilter;

  /*
   * RISK
   */
  const matchesRisk =
    this.riskFilter === 'ALL' ||
    this.getRiskLevel(alert.riskScore) === this.riskFilter;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesRisk
  );
});


}

clearFilters(): void {

this.searchText = '';
this.statusFilter = 'ALL';
this.riskFilter = 'ALL';

this.applyFilters();


}

getSearchText(alert: Alert): string {

return [
  alert.alertId,
  alert.customerId,
  alert.accountId,
  alert.transactionId,
  alert.ruleCode,
  alert.ruleName,
  alert.riskScore,
  alert.alertStatus,
  alert.alertReason,
  alert.triggeredAt,
  alert.createdBy
]
  .filter(value => value !== null && value !== undefined)
  .join(' ')
  .toLowerCase();


}

getRiskLevel(score: number | null): string {

if (score === null || score === undefined) {
  return 'LOW';
}

if (score >= 80) {
  return 'HIGH';
}

if (score >= 50) {
  return 'MEDIUM';
}

return 'LOW';


}

getRiskClass(score: number | null): string {

const level = this.getRiskLevel(score);

switch (level) {

  case 'HIGH':
    return 'risk-high';

  case 'MEDIUM':
    return 'risk-medium';

  case 'LOW':
    return 'risk-low';

  default:
    return '';
}


}

getStatusClass(status: string | null): string {

switch ((status || '').toUpperCase()) {

  case 'OPEN':
    return 'status-open';

  case 'REVIEW':
    return 'status-review';

  case 'CLOSED':
    return 'status-closed';

  default:
    return 'status-default';
}


}

formatDate(date: string | null): string {

if (!date) {
  return '-';
}

const parsedDate = new Date(date);

if (isNaN(parsedDate.getTime())) {
  return date;
}

return parsedDate.toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});


}

formatTime(date: string | null): string {

if (!date) {
  return '';
}

const parsedDate = new Date(date);

if (isNaN(parsedDate.getTime())) {
  return '';
}

return parsedDate.toLocaleTimeString('en-IN', {
  hour: '2-digit',
  minute: '2-digit'
});


}

getInitials(name: string | null): string {

if (!name) {
  return '?';
}

const words = name
  .trim()
  .split(/\s+/);

if (words.length === 1) {
  return words[0].substring(0, 2).toUpperCase();
}

return (
  words[0].charAt(0) +
  words[words.length - 1].charAt(0)
).toUpperCase();


}

get openAlertsCount(): number {

return this.alerts.filter(
  alert =>
    (alert.alertStatus || '').toUpperCase() === 'OPEN'
).length;


}

get closedAlertsCount(): number {

return this.alerts.filter(
  alert =>
    (alert.alertStatus || '').toUpperCase() === 'CLOSED'
).length;


}

get highRiskCount(): number {

return this.alerts.filter(
  alert =>
    this.getRiskLevel(alert.riskScore) === 'HIGH'
).length;


}

}