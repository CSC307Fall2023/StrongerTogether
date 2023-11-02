import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from 'bcryptjs';
import { USER_NOT_SIGNED_IN } from "@/lib/response";

export async function POST(request) {
  /**
   * Overview: take in a request from a form and 
   */
  const responseData = await request.json();
  const { name, email, password } = responseData;
  if (name && email && password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    try {
      user = await prisma.user.create({
        data: { 
          name: name, 
          password: hashedPassword,
          email: email
        }
      });
    } catch (e) {
      return NextResponse.json({error: e.message}, {status: 500 })
    }
    return NextResponse.json(user);
  }
  return USER_NOT_SIGNED_IN;
}

export async function GET(request) {
  // authenticate the user before returning the informations
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const user = await prisma.User.findFirst({
      where: {
        id: {
          equals: loggedInData.user.id
        }
      }
    });
    return NextResponse.json(user);
  }
  return USER_NOT_SIGNED_IN;
}