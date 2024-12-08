"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { RegistrationData, registrationSchema } from "@/lib/schemas";
import bcrypt from "bcrypt"
import db from "@/prisma/prisma"

function hashPass(password: string){
    return bcrypt.hashSync(password, 12)
}


function isSamePass(password: string, hashPass: string){
    return bcrypt.compareSync(password, hashPass)
}



export async function register(prevState: any, formData: FormData) {
  console.log(22,formData)
  const result = registrationSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const {name, email, password } = result.data;

  const password_hash = hashPass(password)

  const userExists = await db.user.findFirst({
    where: {
        email
    }
  })


  if(userExists){
    return {
        errors: "User already exists"
      };
  }


  const newUser = await db.user.create({
    data: {
        name,
        email,
        password_hash
    }
  })
 
  console.log(56, newUser);

  if(newUser){
    await createSession(String(newUser.id));
    redirect("/dashboard");
  }


}

export async function logout() {
  await deleteSession();
  redirect("/login");
}