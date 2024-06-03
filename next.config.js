/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
    path: "/_next/image",
  }
};

const varenv = {
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID ?? "",
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET ?? "",
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY ?? ""
}

export default {config, varenv};
