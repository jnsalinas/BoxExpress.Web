export function parseUtcDate(value: string): Date {
  return new Date(value.endsWith('Z') ? value : value + 'Z');
}

export function toUtcStartOfDayLocal(date: Date | string): Date {
  const d =
    typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

export function toUtcEndOfDayLocal(date: Date | string): Date {
  const d =
    typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
