declare function sanitize(
  input: string,
  options?: {
    replacement?: string | ((substring: string) => string);
    truncate?: number | ((filename: string) => string);
  }
): string;

export = sanitize;
