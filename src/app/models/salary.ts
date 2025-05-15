export interface SalaryRecord {
  date: string;
  amount: string;
  change: string;
  changeClass: string;
  reason: string;
}

export interface CurrentSalary {
  grossMonthly: string;
  netMonthly: string;
  annualBonus: string;
  lastReview: string;
}
