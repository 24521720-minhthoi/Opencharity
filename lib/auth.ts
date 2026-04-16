import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "opencharity_session";
export type UserRole = "ADMIN" | "DONOR" | "CHARITY" | "PARTNER";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: string) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt
    }
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookies().delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          organization: true
        }
      }
    }
  });

  if (!session || session.expiresAt < new Date() || session.user.status !== "ACTIVE") {
    return null;
  }

  return session.user;
}

export async function requireUser(roles?: string[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (roles && !roles.includes(user.role)) redirect("/");
  return user;
}

export function roleHome(role: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "CHARITY" || role === "PARTNER") return "/organization/dashboard";
  return "/account";
}
