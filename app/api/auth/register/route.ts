import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    // 1. Read the JSON request body
    const body = await request.json();
    // 2. Validate it with registerSchema.safeParse()
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid registration data" },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
    // 3. Connect to MongoDB
    await connectDB();
    // 4. Check whether the email is already registered

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 },
      );
    }

    // 5. Hash the password with bcrypt.hash()
    const passwordHash = await bcrypt.hash(password, 12);
    // 6. Create the user with User.create()
    const newUser = await User.create({
      name,
      email,
      passwordHash,
    });
    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 },
    );
    // 7. Return a 201 response without the password hash
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 },
      );
    }
    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Unable to create account" },
      { status: 500 },
    );
  }
}
