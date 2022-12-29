export function getMatchingPositiveIntegerSeries(value: string): RegExp {
  return new RegExp(/^([\d]*[ ,]?)*$/);
}
