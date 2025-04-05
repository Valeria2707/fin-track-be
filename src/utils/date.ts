export function getCurrentMonthRange(): { fromDate: Date; toDate: Date } {
  const now = new Date();
  const fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { fromDate, toDate };
}
