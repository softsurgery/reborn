import { format } from "date-fns";

export function toDateOnly(date: Date) {
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date object");
  }
  return format(date, "yyyy-MM-dd");
}

export function toLongDateString(date: Date): string {
    return format(date, "d MMMM yyyy");
  }