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

export async function DELETE(_request: Request, { params }: Props) {
  try {
    // 1. Check authentication
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    // 2. Connect to MongoDB
    await connectDB();

    // 3. Find the logged-in user
    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 4. Find the community
    const { slug } = await params;

    const community = await Community.findOne({ slug });

    if (!community) {
      return NextResponse.json(
        { error: "Community not found." },
        { status: 404 },
      );
    }

    // 5. Remove the membership
    const membership = await Membership.findOneAndDelete({
      user: user._id,
      community: community._id,
      role: "MEMBER",
    });

    if (!membership) {
      return NextResponse.json(
        {
          message:
            "You are not a member or cannot leave with your current role.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { message: "Successfully left the community." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Leave community error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
