import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { createPostSchema } from "@/lib/validations/post";
import User from "@/models/User";
import Community from "@/models/Community";
import Membership from "@/models/Membership";
import Post from "@/models/Post";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    // 1. Authentication
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 },
      );
    }

    // 2. Validate request body
    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid post data.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    // 3. Connect to MongoDB
    await connectDB();

    const { slug } = await params;

    // 4. Find the community
    const community = await Community.findOne({ slug });

    if (!community) {
      return NextResponse.json(
        { error: "Community not found." },
        { status: 404 },
      );
    }

    // 5. Find the authenticated MongoDB user
    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 401 });
    }

    // 6. Verify membership
    const membership = await Membership.exists({
      user: user._id,
      community: community._id,
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You must join this community before posting." },
        { status: 403 },
      );
    }

    // 7. Generate a unique slug
    const titleSlug = parsed.data.title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);

    const postSlug = `${titleSlug || "post"}-${randomUUID().slice(0, 8)}`;

    // 8. Create and publish the post
    const post = await Post.create({
      title: parsed.data.title,
      slug: postSlug,
      content: parsed.data.content,
      excerpt: parsed.data.content.slice(0, 200),
      author: user._id,
      community: community._id,
      topics: parsed.data.topics,
      status: "PUBLISHED",
      publishedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Post published successfully.",
        post: {
          id: post._id.toString(),
          title: post.title,
          slug: post.slug,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create post error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
export async function GET(_request: Request, { params }: Props) {
  try {
    await connectDB();

    const { slug } = await params;

    const community = await Community.findOne({ slug }).select("_id");

    if (!community) {
      return NextResponse.json(
        { error: "Community not found." },
        { status: 404 },
      );
    }

    const posts = await Post.find({
      community: community._id,
      status: "PUBLISHED",
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("author", "name image")
      .lean();

    return NextResponse.json(
      {
        posts: posts.map((post) => {
          const author = post.author as unknown as {
            _id: { toString(): string };
            name?: string;
            image?: string;
          } | null;

          return {
            id: post._id.toString(),
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            topics: post.topics,
            author: {
              name: author?.name ?? "Unknown user",
              image: author?.image ?? "",
            },
            createdAt: post.createdAt.toISOString(),
          };
        }),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get community posts error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
