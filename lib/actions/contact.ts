"use server"

import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

export async function submitContact(formData: FormData) {
  const validatedFields = formSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  })

  if (!validatedFields.success) {
    return { error: "Invalid form data" }
  }

  const { name, email, message } = validatedFields.data

  try {
    // Here you would typically send an email or store the contact form data
    // For now, we'll just console.log the data
    console.log("Contact form submission:", { name, email, message })

    return { success: true }
  } catch (error) {
    return { error: "Failed to submit contact form" }
  }
}

