import jwt from "jsonwebtoken";

type AuthTokenPayload = {
  id: string;
  role: string;
};

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }

  return secret;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
  } catch {
    return null;
  }
}
