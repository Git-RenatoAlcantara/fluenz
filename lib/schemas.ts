import * as z from "zod"

export type RegistrationData = z.infer<typeof registrationSchema>
export const registrationSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})
export type LoginSchema = z.infer<typeof loginSchema>
export const loginSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
})

export type UrlSchema = z.infer<typeof urlSchema>
export const urlSchema = z.object({
  url: z.string().min(2, {
    message: "Url is empty",
  }),
})

