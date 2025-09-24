import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Input validation helper
function validateInput(name: string, email: string, password: string) {
  const errors: string[] = [];

  if (!name?.trim()) {
    errors.push("Name is required");
  } else if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!email?.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return errors;
}

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { name, email, password } = body;

    // Validate required fields
    const validationErrors = validateInput(name, email, password);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 } // 409 Conflict is more appropriate than 400
      );
    }

    // Hash password with higher salt rounds for better security
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert new user into database
    const [newUser] = await db
      .insert(users)
      .values({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: passwordHash,
        role: "staff", // default role
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt, // assuming you have this field
      });

    // Return user data without password hash
    return NextResponse.json(
      { user: newUser },
      { status: 200 } // Keep 200 for test compatibility
    );

  } catch (error) {
    console.error("Registration error:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Handle database errors
    if (error && typeof error === 'object' && 'code' in error) {
      // Handle specific database errors (e.g., unique constraint violations)
      if (error.code === '23505') { // PostgreSQL unique violation
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}