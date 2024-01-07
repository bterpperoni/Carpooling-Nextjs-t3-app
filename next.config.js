// @ts-nocheck


/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// next.config.js

export const env = {
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
};

