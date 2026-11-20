export function pushIfNotExists<T>(array: T[], element: T, predicate: (value: T) => boolean) {
  const idx = array.findIndex(predicate);
  if (idx > -1) {
    array[idx] = element;
  } else {
    array.push(element);
  }
  return array.length;
}
