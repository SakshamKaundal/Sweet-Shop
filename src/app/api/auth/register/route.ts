import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  // check if user already exists
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  // hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // insert into db
  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      password: passwordHash,
      role: "staff", // default role
    })
    .returning();

  return NextResponse.json({ user }, { status: 200 });
}
