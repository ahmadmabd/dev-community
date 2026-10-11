import mongoose, {
  Schema,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export interface IMembership extends Document {
  user: Types.ObjectId;
  community: Types.ObjectId;
  role: "MEMBER" | "MODERATOR" | "ADMIN";
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema = new Schema<IMembership>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },

    role: {
      type: String,
      enum: ["MEMBER", "MODERATOR", "ADMIN"],
      default: "MEMBER",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// A user can join a community only once.
MembershipSchema.index({ user: 1, community: 1 }, { unique: true });

// Efficiently find members of a community.
MembershipSchema.index({ community: 1, role: 1 });

const Membership: Model<IMembership> =
  (mongoose.models.Membership as Model<IMembership>) ||
  mongoose.model<IMembership>("Membership", MembershipSchema);

export default Membership;
