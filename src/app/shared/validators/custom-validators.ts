import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minLengthArray(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length >= min) {
      return null;
    }
    return { minLengthArray: { requiredLength: min, actualLength: control.value.length } };
  };
}
