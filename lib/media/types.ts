export interface MediaFile {
  id: string
  filename: string
  url: string
  size: number
  type: string
  width?: number
  height?: number
  uploadedAt: Date
  updatedAt: Date
}

export interface UploadResponse {
  success: boolean
  file?: MediaFile
  error?: string
}

export interface DeleteResponse {
  success: boolean
  error?: string
}

