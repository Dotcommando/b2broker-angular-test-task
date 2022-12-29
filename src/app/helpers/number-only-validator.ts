import { AbstractControl, ValidationErrors } from '@angular/forms';
import { getMatchingNumber } from '@helpers/get-matching-number';

export function numbersOnlyValidator({ value }: AbstractControl): ValidationErrors | null {
  return (Boolean(value) && getMatchingNumber(value).test(value))
    ? null
    : { valueIsNotANumber: true };
}
