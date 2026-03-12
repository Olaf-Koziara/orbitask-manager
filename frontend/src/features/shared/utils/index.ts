import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const prepareQueryInput = <T extends Record<string, unknown>>(filters: T): Partial<T> => {
  if (!filters) return {} as Partial<T>;
  const input: Partial<T> = {};

  (Object.keys(filters) as Array<keyof T>).forEach(key => {
    const value = filters[key];
    if (value !== undefined && value !== null && value !== '') {
      input[key] = value;
    }
  });
  return input;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}