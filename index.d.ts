declare function sanitize(
  input: string,
  options?: {
    replacement?: string | ((substring: string) => string);
    invalid?: string[];
  }
): string;

export = sanitize;
