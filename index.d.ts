declare function sanitize(
  input: string,
  options?: {
    replacement?: string | ((substring: string) => string);
    extension?: string;
  }
): string;

export = sanitize;
