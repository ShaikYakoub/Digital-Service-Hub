"use server";

import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function signup(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("Signup attempt for:", email)

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

    console.log("User created successfully:", email)

    // Redirect to login
    redirect("/auth/login?message=Account created successfully")
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}