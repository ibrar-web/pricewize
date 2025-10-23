export * from "./searchNormalizer";
export * from "./formatPrice";
export * from "./security";

// Utility function to combine classnames
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

