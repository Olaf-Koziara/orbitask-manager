export const prepeareQueryInput = <T>(filters: T): Partial<T> => {
  if (!filters) return {};
  const input: any = {};
  Object.keys(filters as object).forEach(key => {
    if (filters[key as keyof T] !== undefined && filters[key as keyof T] !== null && filters[key as keyof T] !== '') {
      input[key] = filters[key as keyof T];
    }
  });
  return input;
};
