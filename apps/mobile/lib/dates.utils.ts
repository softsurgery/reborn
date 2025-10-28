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

export function timeAgo(input: string | Date): string {
  const date = input instanceof Date ? input : new Date(input);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
