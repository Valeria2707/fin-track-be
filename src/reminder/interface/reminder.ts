export enum ReminderType {
  BILL_PAYMENT = 'bill_payment',
  TRANSACTION_ALERT = 'transaction_alert',
  BUDGET_REVIEW = 'budget_review',
  PERSONAL_EVENT = 'personal_event',
  GENERAL = 'general',
}

export interface IReminder {
  id: number;
  user_id: number;
  type: ReminderType;
  message: string;
  reminder_date: Date;
}
