import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config";

const ADMIN_STORAGE_KEY = "arsa_admin_auth";

export interface AdminUser {
  email: string;
  name?: string;
  role: string;
  isSuperAdmin: boolean;
}

/**
 * Checks if the given email is in the admin allowlist
 */
export function isEmailAuthorized(email: string): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();

  // Allowed domains or specific emails from env
  const envAllowlist = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .toLowerCase()
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (cleanEmail === "admin@arsa.org") return true;
  if (cleanEmail.endsWith("@jspmrscoe.edu.in")) return true;
  if (envAllowlist.includes(cleanEmail)) return true;

  return false;
}

/**
 * Gets currently logged in admin user from session or Firebase
 */
export function getCurrentAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Logs in admin using Firebase Auth or local verification
 */
export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  const cleanEmail = email.toLowerCase().trim();

  if (!isEmailAuthorized(cleanEmail)) {
    throw new Error("This email is not in the ARSA Admin authorized allowlist.");
  }

  // 1. Try Firebase Auth if configured
  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const adminUser: AdminUser = {
        email: userCredential.user.email || cleanEmail,
        name: userCredential.user.displayName || "ARSA Administrator",
        role: "Event Organiser & Admin",
        isSuperAdmin: cleanEmail === "admin@arsa.org",
      };
      saveAdminSession(adminUser);
      return adminUser;
    } catch (firebaseErr: any) {
      console.warn("Firebase Auth signIn failed:", firebaseErr.message);
      // If Firebase auth fails with wrong-password, throw error
      if (firebaseErr.code === "auth/wrong-password" || firebaseErr.code === "auth/invalid-credential") {
        throw new Error("Invalid password credentials.");
      }
    }
  }

  // 2. Allow fallback admin authentication for initial local setup/demo
  if (password.length >= 6) {
    const adminUser: AdminUser = {
      email: cleanEmail,
      name: cleanEmail === "admin@arsa.org" ? "Super Admin" : "Faculty Organiser",
      role: "Event Organiser & Admin",
      isSuperAdmin: cleanEmail === "admin@arsa.org",
    };
    saveAdminSession(adminUser);
    return adminUser;
  }

  throw new Error("Password must be at least 6 characters.");
}

function saveAdminSession(user: AdminUser) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
}

/**
 * Logs out admin
 */
export async function logoutAdmin(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn("Firebase signout error:", e);
    }
  }
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
}
