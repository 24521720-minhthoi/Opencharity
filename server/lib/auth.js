import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../models.js";

const secret = process.env.AUTH_SECRET || "opencharity-local-demo-secret";

function sign(payload) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function issueToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      userId: user._id.toString(),
      role: user.role,
      issuedAt: Date.now()
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (signature !== sign(payload)) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function publicUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    organization: user.organization,
    supplier: user.supplier,
    impact: user.impact
  };
}

export async function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function requireAuth(roles = []) {
  return async (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    const parsed = verifyToken(token);

    if (!parsed) {
      return res.status(401).json({ message: "Vui lòng đăng nhập để tiếp tục." });
    }

    const user = await User.findById(parsed.userId).populate("organization supplier");
    if (!user || user.status !== "ACTIVE") {
      return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ." });
    }

    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ message: "Tài khoản không có quyền thực hiện thao tác này." });
    }

    req.user = user;
    next();
  };
}
