// Define public routes that don't require authentication
export const PUBLIC_ROUTES = [
  "/auth/signin",
  "/auth/forgot-password",
  "/auth/error",
  "/auth/signup",
];

// Array of api routes that don't require authentication
export const UNAUTH_API_ROUTES = [
  "/user-login",
  "/send-otp",
  "/reset-password",
  "/verify-invite",
  "/user/signup",
  "/refresh-access-token",
];

export const SERVICE_BASE_URLS: Record<string, string | undefined> = {
  auth: process.env.AUTH_API_BASE_URL,
  user: process.env.USER_API_BASE_URL,
  itemMaster: process.env.ITEM_MASTER_BASE_URL,
  freightRate: process.env.ITEM_MASTER_BASE_URL,
  tariffRate: process.env.ITEM_MASTER_BASE_URL,
  fxRate: process.env.ITEM_MASTER_BASE_URL,
  exportRate: process.env.EXPORT_API_BASE_URL,
  common: process.env.ITEM_MASTER_BASE_URL
};

export const INTERNAL_API_BASE_PATH = "/client-service";
