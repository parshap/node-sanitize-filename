declare function sanitize(
  input: string,
  options?: {
    replacement?: string | ((substring: string) => string);
    truncateLength?: number;
    preserveFileExt?: boolean;
  }
): string;

export = sanitize;
