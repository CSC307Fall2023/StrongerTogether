import bcrypt from 'bcryptjs';
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";

const authOptions = {
  debug: process.env.NODE_ENV !== "production",
  providers: [ CredentialsProvider({
    id: 'normal',
    name: "Email / Password",
    async authorize({email = '', password, rememberMe}) {
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
            return { userId: id, email, rememberMe };
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
        
        if (Date.now() > token.customExpires) {
          console.log("Token has expired, sending signal to front end to sign out");
          session.isExpired = Date.now() > token.customExpires;
        }
      }
      return session;
    },
    async jwt({token, user}) {
      if (user) {
        token.userId = user.userId;
        // console.log("the received remeberme is" + user.rememberMe);
        let expirationTime;
        const rememberMeConst = user.rememberMe;
        if (rememberMeConst === "true") {
          expirationTime = 30 * 24 * 60 * 60 * 1000;
        } else {
          // 1 hour
          expirationTime = 60 * 60 * 1000;
        }

        token.customExpires = Date.now() + expirationTime;
        console.log("Setting token.customExpires to " + new Date(token.customExpires));
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

export { authOptions };