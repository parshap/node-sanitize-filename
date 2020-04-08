declare function sanitize(
  input: string,
  options?: {
    replacement?: string | ((substring: string) => string);
    additionalInvalids?: string[];
  }
): string;

export = sanitize;
