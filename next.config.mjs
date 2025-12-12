import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    // Turbopack configuration will be merged here
  },
}

// Apply next-intl plugin (this may add config to experimental.turbo)
const finalConfig = withNextIntl(nextConfig)

// Move turbo config from experimental.turbo to turbopack for stable Turbopack
if (finalConfig.experimental?.turbo) {
  finalConfig.turbopack = {
    ...(finalConfig.turbopack || {}),
    ...finalConfig.experimental.turbo,
  }
  // Remove the old experimental.turbo to avoid warnings
  delete finalConfig.experimental.turbo
}

export default finalConfig
