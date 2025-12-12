import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Ensure that the incoming `locale` is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  let messages
  if (locale === "ar") {
    messages = (await import("../messages/ar.json")).default
  } else {
    messages = (await import("../messages/en.json")).default
  }

  return {
    locale,
    messages,
  }
})

