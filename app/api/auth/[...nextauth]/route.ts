import { connectMongoDB } from "@/lib/mongodb";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) {
          console.log("❌ Credentials not provided");
          return null;
        }
        const { username, password } = credentials;

        try {
          await connectMongoDB();

          console.log("🔍 Checking MongoDB for username:", username);

          const user = await mongoose.connection
            .collection("admin") // <--- Explicitly specify "admin" collection
            .findOne({ username });

          if (!user) {
            console.log("❌ No user found for:", username);
            return null;
          }

          console.log("🔍 Stored Hash for", username, ":", user.password);

          // ✅ Compare hashed passwords
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            console.log("❌ Incorrect password for:", username);
            return null;
          }

          console.log("✅ Successfully authenticated:", username);
          
          // ✅ Return the user object
          return {
            id: user._id.toString(),
            username: user.username,
          };
        } catch (error) {
          console.error("❌ Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

// ✅ Create NextAuth handler
const handler = NextAuth(authOptions);

// ✅ Correct exports for Next.js App Router
export { handler as GET, handler as POST };
