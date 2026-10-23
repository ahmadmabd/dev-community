import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
type Props = {
  params: Promise<{ slug: string }>;
};
export async function GET(request: Request, { params }: Props) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await Post.findOne({ slug, status: "PUBLISHED" });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const comments = await Comment.find({ post: post._id })
      .populate("author", "name image")
      .sort({ createdAt: 1 });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, { params }: Props) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    if (typeof body?.content !== "string") {
      return NextResponse.json(
        { error: "Content must be a string" },
        { status: 400 },
      );
    }
    const content = body.content.trim();
    if (content.length < 1 || content.length > 2000) {
      return NextResponse.json(
        { error: "Content must contain 1 to 2000 characters" },
        { status: 400 },
      );
    }
    const authorEmail = session.user.email;
    await connectDB();
    const author = await User.findOne({ email: authorEmail.toLowerCase() });
    if (!author) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { slug } = await params;
    const post = await Post.findOne({ slug, status: "PUBLISHED" });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const comment = await Comment.create({
      post: post._id,
      author: author._id,
      content,
    });
    await comment.populate("author", "name image");
    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
