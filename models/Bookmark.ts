import mongoose, {
  Schema,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export interface IBookmark extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate bookmarks.
BookmarkSchema.index({ user: 1, post: 1 }, { unique: true });

// Efficiently list a user's bookmarks, newest first.
BookmarkSchema.index({
  user: 1,
  createdAt: -1,
});

const Bookmark: Model<IBookmark> =
  (mongoose.models.Bookmark as Model<IBookmark>) ||
  mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

export default Bookmark;
