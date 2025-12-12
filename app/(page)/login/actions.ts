"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { LoginSchema, RegistrationData } from "@/lib/schemas";
import bcrypt from "bcrypt";
import db from "@/prisma/prisma";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  console.log(formData)
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  // Buscar usuário no banco de dados
  const user = await db.user.findFirst({
    where: {
      email
    }
  });

  // Verificar se o usuário existe e se a senha está correta
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession(String(user.id));

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}