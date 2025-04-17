import { addMonths, endOfMonth, format, startOfMonth } from 'date-fns';

export function getCurrentMonthRange(): { fromDate: Date; toDate: Date } {
  const now = new Date();
  const fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { fromDate, toDate };
}

export function formatDate(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'yyyy-MM-dd');
}

export function getMonthRange(offset = 0) {
  const base = addMonths(new Date(), offset);
  return { fromDate: startOfMonth(base), toDate: endOfMonth(base) };
}
