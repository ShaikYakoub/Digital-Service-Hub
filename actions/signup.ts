"use server";

import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export interface SignupState {
  error?: string;
  success?: boolean;
}

export async function signup(prevState: SignupState | null, formData: FormData): Promise<SignupState | null> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("Signup attempt for:", email)

  if (!name || !email || !password) {
    return { error: "All fields are required" }
  }

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: "User with this email already exists" }
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

    console.log("User created successfully:", email)

    // Return success state instead of redirecting
    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    return { error: "Failed to create account. Please try again." }
  }
}