import { randomBytes, scrypt, scryptSync, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(scrypt);
export const roles = ["admin", "writer", "reader"] as const;
export type Role = (typeof roles)[number];

export function isRole(value: unknown): value is Role {
  return value === "admin" || value === "writer" || value === "reader";
}

export function isUsername(value: string) {
  return /^[a-z0-9_.-]{3,40}$/.test(value);
}

export function validPassword(value: string) {
  return value.length >= 12 && value.length <= 128;
}

export function bootstrapPasswordHash(value: string) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(value, salt, 64).toString("hex");
}

export async function passwordHash(value: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await derive(value, salt, 64)) as Buffer;
  return salt + ":" + hash.toString("hex");
}

export async function checkPassword(value: string, encoded?: string) {
  const [salt, expected] = (encoded ?? "0".repeat(32) + ":" + "0".repeat(128)).split(":");
  const actual = (await derive(value, salt, 64)) as Buffer;
  return timingSafeEqual(actual, Buffer.from(expected, "hex")) && !!encoded;
}
