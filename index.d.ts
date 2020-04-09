declare function sanitize(
  input: string,
  options?: {
    replacement?: string | ((substring: string) => string);
    additionalInvalidStrings?: string[];
  }
): string;

export = sanitize;
