import { startOfYear, endOfYear, eachMonthOfInterval, eachDayOfInterval, format } from 'date-fns';

export const getCurrentYear = (): Date => {
  return new Date();
};

export const getMonthsInYear = (year: Date) => {
  const start = startOfYear(year);
  const end = endOfYear(year);
  return eachMonthOfInterval({ start, end });
};

export const getDaysInMonth = (month: Date) => {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  return eachDayOfInterval({ start, end });
};

export const formatDate = (date: Date, formatStr: string): string => {
  return format(date, formatStr);
};
