import bcrypt from 'bcryptjs';
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";

const authOptions = {
  debug: true,
  providers: [ CredentialsProvider({
    id: 'normal',
    name: "Email / Password",
    async authorize({email = '', password}) {
      console.log("credentials: ", email, password);
      try {
        const user = await prisma.User.findFirst({
          where: {
            email: {
              equals: email
            }
          }
        });
        if (user != null) {
          const samePassword = await bcrypt.compare(password, user.password);
          if (samePassword) {
            let { id, email } = user;
            return { userId: id, email };
          }
        }
      } catch (error) {
        console.log("error", JSON.stringify(error));
      }
      return null;
    }
  })],
  callbacks: {
    async session({session, token}) {
      if (token) {
        session.user.id = token.userId;
      }
      return session;
    },
    async jwt({token, user}) {
      if (user) {
        token.userId = user.userId;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

export { authOptions };