import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";
import User from "../models/User";
import Community from "../models/Community";
const communities = [
  {
    name: "React Developers",
    slug: "react-developers",
    description:
      "A community for developers who love React and want to share knowledge, ask questions, and collaborate on projects.",
    topics: ["React", "JavaScript"],
  },
  {
    name: "Next.js Developers",
    slug: "nextjs-developers",
    description:
      "A community for developers who love Next.js and want to share knowledge, ask questions, and collaborate on projects.",
    topics: ["Next.js", "TypeScript"],
  },
  {
    name: "Python Developers",
    slug: "python-developers",
    description:
      "A community for developers who love Python and want to share knowledge, ask questions, and collaborate on projects.",
    topics: ["Python", "Django"],
  },
];
async function seed() {
  // Step 1: Connect to MongoDB
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }
  await mongoose.connect(uri, {
    dbName: "devcommunity",
    serverSelectionTimeoutMS: 10000,
    bufferCommands: false,
  });

  // Step 2: Find or create a sample user
  const user = await User.findOneAndUpdate(
    { email: "demo@devcommunity.local" },
    {
      $setOnInsert: {
        name: "Demo Developer",
        email: "demo@devcommunity.local",
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
  for (const community of communities) {
    await Community.updateOne(
      { slug: community.slug },
      {
        $setOnInsert: {
          ...community,
          createdBy: user._id,
        },
      },
      { upsert: true },
    );
  }
  console.log("Database seeded successfully!");
}

// Run the function and handle errors.
seed()
  .catch(console.error)
  .finally(async () => {
    await mongoose.disconnect();
  });
