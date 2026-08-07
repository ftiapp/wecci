import "server-only";

/**
 * ระบบเซสชันแอดมินแบบง่าย — คุกกี้ที่เซ็นด้วย HMAC-SHA256
 * ไม่ต้องพึ่งไลบรารีภายนอก และใช้ Web Crypto จึงทำงานได้ทั้งใน proxy และ route handler
 */

export const SESSION_COOKIE = "wecci_admin";
/** อายุเซสชัน 8 ชั่วโมง (หน่วยวินาที) */
export const SESSION_MAX_AGE = 8 * 60 * 60;

/**
 * กุญแจสำหรับเซ็นคุกกี้ — ถ้าไม่ได้ตั้ง ADMIN_SESSION_SECRET ไว้
 * จะสร้างจากชื่อผู้ใช้+รหัสผ่านแอดมินแทน จึงไม่ต้องมีตัวแปรเพิ่มก็ได้
 * (ผลข้างเคียง: เปลี่ยนรหัสผ่านเมื่อไหร่ เซสชันที่เปิดค้างอยู่จะหลุดทันที ซึ่งเป็นเรื่องดี)
 */
function secretKey() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    `${process.env.ADMIN_USERNAME ?? ""}:${process.env.ADMIN_PASSWORD ?? ""}`;

  if (secret.length < 8) {
    throw new Error("ยังไม่ได้ตั้งค่า ADMIN_USERNAME / ADMIN_PASSWORD ในไฟล์ .env");
  }
  return new TextEncoder().encode(secret);
}

function toBase64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    secretKey(),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(new Uint8Array(signature));
}

/** สร้างค่าคุกกี้: <username>.<หมดอายุ>.<ลายเซ็น> */
export async function createSessionToken(username: string) {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${username}.${expiresAt}`;
  return `${payload}.${await sign(payload)}`;
}

/** ตรวจลายเซ็นและวันหมดอายุ คืนชื่อผู้ใช้ถ้าใช้ได้ */
export async function verifySessionToken(token: string | undefined) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [username, expiresAt, signature] = parts;
  const payload = `${username}.${expiresAt}`;

  if (await sign(payload) !== signature) return null;
  if (Number(expiresAt) < Date.now()) return null;

  return username;
}

/** ตรวจรหัสผ่านแบบเทียบทีละตัวอักษรจนครบ กัน timing attack */
export function isValidCredential(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";

  if (!expectedUser || !expectedPass) return false;

  const compare = (a: string, b: string) => {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  };

  return compare(username, expectedUser) && compare(password, expectedPass);
}
