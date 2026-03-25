import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  isLoggedIn: boolean;
}

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long_for_iron_session_to_secure_aws_credentials",
  cookieName: "cloudpulse_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }

  return session;
}
