import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";

const isClient = typeof window !== "undefined";

/**
 * Auth must use the same browser origin as the Next app so session cookies are set
 * for localhost:3000 (or your deployed host). API calls use /api/v1 via rewrites.
 * Using the raw API port (5000) directly breaks session cookies for proxied axios calls.
 */
function resolveAuthBaseURL(): string {
  if (isClient) {
    return window.location.origin;
  }
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_CLIENT_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const trimmed = fromEnv.replace(/\/$/, "");
  if (trimmed) {
    return trimmed;
  }
  return "http://127.0.0.1:3000";
}

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseURL(),
  basePath: "/api/v1/auth",
  plugins: [customSessionClient()],
});

export const { useSession, signIn, signOut, signUp } = authClient;
