"use server";

import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function signup(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!name || !email || !password) {
    throw new Error("All fields are required")
  }

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await hash(password, 12)

  // Create user
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER"
    }
  })

  // Redirect to login
  redirect("/auth/login?message=Account created successfully")
}