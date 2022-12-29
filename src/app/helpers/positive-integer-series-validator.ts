import { AbstractControl, ValidationErrors } from '@angular/forms';
import { getMatchingPositiveIntegerSeries } from '@helpers/get-matching-positive-integer-series';

export function positiveIntegerSeriesValidator({ value }: AbstractControl): ValidationErrors | null {
  if (!value) return null;

  return getMatchingPositiveIntegerSeries(value).test(value)
    ? null
    : { valueIsNotASeriesOfPositiveNumbers: true };
}
