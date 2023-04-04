export type Predicate<T> = (item: T) => boolean;

export const matchAll =
  <T>(predicates: Predicate<T>[]) =>
  (item: T) => {
    for (const p of predicates) {
      if (!p(item)) return false;
    }
    return true;
  };
