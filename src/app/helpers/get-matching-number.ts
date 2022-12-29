export function getMatchingNumber(value: string): RegExp {
  return new RegExp(/^[\d]*\.?[\d]*$/);
}
