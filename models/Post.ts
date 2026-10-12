import mongoose, {
  Schema,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export type PostStatus = "DRAFT" | "PUBLISHED";

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: Types.ObjectId;
  community: Types.ObjectId;
  topics: string[];
  status: PostStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
      default: "",
      maxlength: 500,
    },

    coverImage: {
      type: String,
      default: "",
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },

    topics: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Find posts by community, newest first.
PostSchema.index({
  community: 1,
  status: 1,
  createdAt: -1,
});

// Find posts by author.
PostSchema.index({
  author: 1,
  createdAt: -1,
});

// Filter posts by topic.
PostSchema.index({
  topics: 1,
  status: 1,
});

// Basic text search.
PostSchema.index({
  title: "text",
  content: "text",
});

const Post: Model<IPost> =
  (mongoose.models.Post as Model<IPost>) ||
  mongoose.model<IPost>("Post", PostSchema);

export default Post;
