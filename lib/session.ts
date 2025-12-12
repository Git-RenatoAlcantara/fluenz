import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_VERIFY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  cookies().set("userId", userId)
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function deleteSession() {
  cookies().delete("session");
}

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    // Sessão inválida ou inexistente - comportamento normal para usuários não autenticados
    return null;
  }
}

export async function getSession(): Promise<{userId: string | undefined, expiresAt: string | undefined}>{
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);
  
  // Fallback para o cookie userId se o JWT falhar
  const userId = session?.userId as string || cookies().get("userId")?.value;
  
  return {
    userId: userId,
    expiresAt: session?.expiresAt as string
  }
}