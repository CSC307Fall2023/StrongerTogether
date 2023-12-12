import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";
import { USER_NOT_SIGNED_IN } from "@/lib/response";

export async function POST(request) {
  /**
   * Overview: take in a request from a form and create a comment
   */
  const responseData = await request.json();
  const { comment, postId } = responseData;
  const loggedInData = await checkLoggedIn(); // check user sign in
  if (loggedInData.loggedIn) {
    const userId = loggedInData.user.id;
    let commented;
    const newCommentData = {
      comment,
      post: { connect: { id: postId } },
      user: { connect: { id: userId } },
    };
    try {
      commented = await prisma.Comment.create({
        data: { 
          ...newCommentData
        }
      });
    } catch (e) {
      console.log(e.message);
      return NextResponse.json({error: e.message}, {status: 500 })
    }
    return NextResponse.json(commented);
  }
  return USER_NOT_SIGNED_IN;
}