export function numberArraysAreEqual(prevArr: number[] | undefined, nextArr: number[] | undefined): boolean {
  if (prevArr?.length !== nextArr?.length) {
    return false;
  }

  if (!prevArr && !nextArr) {
    return true;
  }

  if ((!prevArr && nextArr) || (prevArr && !nextArr)) {
    return false;
  }

  for (let i = 0; i < (prevArr as number[]).length; i++) {
    if ((prevArr as number[])[i] !== (nextArr as number[])[i]) {
      return false;
    }
  }

  return true;
}
