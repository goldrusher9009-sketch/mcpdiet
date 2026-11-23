import { createPublicKey, verify } from "node:crypto";
const PUB = "-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAsrAg1cKDi1OLUDwgc0D102GZqdNslWd0dyTNn/7lwVo=\n-----END PUBLIC KEY-----\n";
export interface License { email: string; plan: string; exp: number }
/** Key format: base64url(payloadJson).base64url(ed25519 signature). Verified offline. */
export function checkLicense(key: string | undefined): License {
  if (!key) throw new Error("This is a Pro feature. Set MCPSEAL_KEY to your license key.");
  const [p, s] = key.trim().split(".");
  if (!p || !s) throw new Error("Invalid license key format.");
  const ok = verify(null, Buffer.from(p), createPublicKey(PUB), Buffer.from(s, "base64url"));
  if (!ok) throw new Error("Invalid license key.");
  const lic = JSON.parse(Buffer.from(p, "base64url").toString()) as License;
  if (lic.exp < Date.now() / 1000) throw new Error("License key expired. Renew to keep using Pro features.");
  return lic;
}
