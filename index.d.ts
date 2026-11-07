declare function sanitize(
  input: string,
  options?: {
    replacement?: string | ((substring: string, offset: number, string: string) => string);
  }
): string;

export = sanitize;
