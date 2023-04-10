/**
 * Remove an item from an array.
 * @param array array to change
 * @param item item to remove
 * @returns whether item was found
 */
export default function removeItem<T>(array: T[], item: T) {
  const index = array.indexOf(item);
  if (index >= 0) {
    array.splice(index, 1);
    return true;
  }
  return false;
}
