export const mediaConfig = {
  images: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    dimensions: {
      thumbnail: { width: 200, height: 200 },
      preview: { width: 600, height: 400 },
      full: { width: 1200, height: 800 },
    },
  },
  files: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
}

export const optimizationConfig = {
  images: {
    quality: 80,
    format: "webp",
    placeholder: "blur",
    loading: "lazy",
  },
}

