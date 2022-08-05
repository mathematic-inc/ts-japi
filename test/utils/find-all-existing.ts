export function findAllExisting<T, U>(array: T[], predicate: (value: T) => U) {
  const elements: U[] = [];
  let changes = false;
  for (let i = 0; i < array.length; i++) {
    const id = array[i];
    const element = predicate(id);
    if (!element) {
      array.splice(i, 1);
      changes = true;
    } else elements.push(element);
  }
  return elements;
}
