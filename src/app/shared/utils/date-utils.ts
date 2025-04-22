export function parseUtcDate(value: string): Date {
  return new Date(value.endsWith('Z') ? value : value + 'Z');
}

export function toUtcStartOfDayLocal(date: Date | string): string {
  console.log('toUtcStartOfDayLocal', date);
  const d =
    typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
  const localStart = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    0,
    0,
    0,
    0
  );
  return localStart.toISOString();
}

export function toUtcEndOfDayLocal(date: Date | string): string {
  console.log('toUtcEndOfDayLocal', date);

  const d =
    typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
  const localEnd = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    23,
    59,
    59,
    999
  );
  return localEnd.toISOString();
}
