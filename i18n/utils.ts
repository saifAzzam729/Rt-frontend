import { locales, type Locale, isLocale } from "./config";

export function splitPathname(pathname: string): {
  locale: Locale | null;
  pathnameWithoutLocale: string;
} {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (maybeLocale && isLocale(maybeLocale)) {
    const without = segments.slice(2).join("/");
    return {
      locale: maybeLocale,
      pathnameWithoutLocale: `/${without}`.replace(/\/$/, "") || "/",
    };
  }

  return {
    locale: null,
    pathnameWithoutLocale: pathname || "/",
  };
}

export function ensureLocale(locale?: string | null): Locale {
  if (locale && locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return locales[0];
}
