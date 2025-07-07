import { isEmpty, defaults } from '../shared/utils';

describe('isEmpty', () => {
  test('handles null and undefined', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  test('handles arrays and strings', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty('a')).toBe(false);
  });

  test('handles objects, maps and sets', () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});

describe('defaults', () => {
  test('fills undefined values from source', () => {
    const obj = { a: 1 } as { a: number; b?: number };
    const result = defaults(obj, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  test('existing values are not overwritten', () => {
    const obj = { a: 1, b: 3 };
    const result = defaults(obj, { b: 2 });
    expect(result).toEqual({ a: 1, b: 3 });
  });
});
