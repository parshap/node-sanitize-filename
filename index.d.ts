declare function sanitize(
  input: string,
  options?: {
    replacement?: string | ((substring: string) => string);
  }
): string;

declare namespace sanitize { }

export = sanitize;
