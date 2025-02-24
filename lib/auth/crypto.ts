import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12
const SALT_LENGTH = 16
const TAG_LENGTH = 16
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY environment variable is not set")
}

export async function encrypt(text: string): Promise<string> {
  const iv = randomBytes(IV_LENGTH)
  const salt = randomBytes(SALT_LENGTH)

  const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, "hex"), iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  const authTag = cipher.getAuthTag()

  // Combine IV, salt, auth tag, and encrypted data
  const combined = Buffer.concat([iv, salt, authTag, Buffer.from(encrypted, "hex")])

  return combined.toString("base64")
}

export async function decrypt(encrypted: string): Promise<string> {
  const buf = Buffer.from(encrypted, "base64")

  const iv = buf.subarray(0, IV_LENGTH)
  const salt = buf.subarray(IV_LENGTH, IV_LENGTH + SALT_LENGTH)
  const authTag = buf.subarray(IV_LENGTH + SALT_LENGTH, IV_LENGTH + SALT_LENGTH + TAG_LENGTH)
  const encryptedText = buf.subarray(IV_LENGTH + SALT_LENGTH + TAG_LENGTH)

  const decipher = createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, "hex"), iv)

  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encryptedText.toString("hex"), "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
