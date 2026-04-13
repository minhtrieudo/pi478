export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SDK_LITE_URL: "https://pi-apps.github.io/pi-sdk-lite/build/production/sdklite.js",
  APP_ID: process.env.NEXT_PUBLIC_PI_APP_ID || "pibreath",
  SANDBOX: process.env.NEXT_PUBLIC_PI_SANDBOX !== "false",
  VERSION: "2.0",
} as const;

export const SUPABASE_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
} as const;
