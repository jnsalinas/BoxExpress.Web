import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minLengthArray(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length >= min) {
      return null;
    }
    return {
      minLengthArray: {
        requiredLength: min,
        actualLength: control.value.length,
      },
    };
  };
}

export function passwordPattern(
  control: AbstractControl
): ValidationErrors | null {
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+=\-{}[\]:;"'<>?,./]{8,}$/;

  if (control.value && !passwordPattern.test(control.value)) {
    return { passwordPattern: true };
  }
  return null;
}
