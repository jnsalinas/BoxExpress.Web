import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcDate',
  standalone: true,
})
export class UtcDatePipe implements PipeTransform {
  transform(value: string | Date | undefined, withSeconds: boolean = false): string | null {
    if (!value) return null; // Si value es undefined o null, retornamos null

    // Asegurarse de que value es un string válido
    const date = new Date(typeof value === 'string' && !value.endsWith('Z') ? value + 'Z' : value);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: withSeconds ? '2-digit' : undefined,
      hour12: false,
    };

    return new Intl.DateTimeFormat(undefined, options).format(date);
  }
}
