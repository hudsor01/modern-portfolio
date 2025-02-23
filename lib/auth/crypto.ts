import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const algorithm = "aes-256-gcm"
const ivLength = 12
const saltLength = 16
const tagLength = 16
const tagPosition = saltLength + ivLength
const encryptedPosition = tagPosition + tagLength

export function encrypt(text: string): string {
  const iv = randomBytes(ivLength)
  const salt = randomBytes(saltLength)
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex")

  const cipher = createCipheriv(algorithm, key, iv)
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  const buffer = Buffer.concat([salt, iv, tag, encrypted])
  return buffer.toString("base64")
}

export function decrypt(encdata: string): string {
  const buffer = Buffer.from(encdata, "base64")
  const salt = buffer.subarray(0, saltLength)
  const iv = buffer.subarray(saltLength, tagPosition)
  const tag = buffer.subarray(tagPosition, encryptedPosition)
  const encrypted = buffer.subarray(encryptedPosition)
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex")

  const decipher = createDecipheriv(algorithm, key, iv)
  decipher.setAuthTag(tag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])

  return decrypted.toString("utf8")
}

