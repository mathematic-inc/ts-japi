export function findAllExisting<T, U>(array: T[], predicate: (value: T) => U | undefined) {
  const elements: U[] = [];
  let _changes = false;
  for (let i = 0; i < array.length; i++) {
    const id = array[i]!;
    const element = predicate(id);
    if (element === undefined) {
      array.splice(i, 1);
      _changes = true;
    } else {
      elements.push(element);
    }
  }
  return elements;
}
