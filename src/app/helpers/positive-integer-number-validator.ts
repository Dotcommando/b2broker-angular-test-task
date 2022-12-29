import { AbstractControl, ValidationErrors } from '@angular/forms';

export function positiveIntegerNumberValidator({ value }: AbstractControl): ValidationErrors | null {
  const valueAsNumber = Number(value);

  return (!isNaN(valueAsNumber) && valueAsNumber > 0 && parseInt(value) === valueAsNumber)
    ? null
    : { valueIsNotAPositiveNumber: true };
}
