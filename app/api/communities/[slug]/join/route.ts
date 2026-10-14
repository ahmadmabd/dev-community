import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Community from "@/models/Community";
import Membership from "@/models/Membership";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(_request: Request, { params }: Props) {
  try {
    // 1. Check if the user is logged in.
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    // 2. Connect to MongoDB.
    await connectDB();

    // 3. Find the real MongoDB user.
    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 4. Find the community.
    const { slug } = await params;

    const community = await Community.findOne({ slug });

    if (!community) {
      return NextResponse.json(
        { error: "Community not found." },
        { status: 404 },
      );
    }

    // 5. Check if the user is already a member.
    const existingMembership = await Membership.findOne({
      user: user._id,
      community: community._id,
    });

    if (existingMembership) {
      return NextResponse.json(
        { message: "You are already a member of this community." },
        { status: 200 },
      );
    }

    // 6. Create the membership.
    await Membership.create({
      user: user._id,
      community: community._id,
      role: "MEMBER",
    });

    return NextResponse.json(
      { message: "Successfully joined the community." },
      { status: 201 },
    );
  } catch (error) {
    // Handle simultaneous join requests safely.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { message: "You are already a member of this community." },
        { status: 200 },
      );
    }

    console.error("Join community error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
