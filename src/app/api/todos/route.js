import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";
import { USER_NOT_SIGNED_IN } from "@/lib/response";

export async function GET(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const todos = await prisma.toDo.findMany({
      where: {
        ownerId: {
          equals: loggedInData.user?.id
        }
      }
    });
    return NextResponse.json(todos);
  }
  return USER_NOT_SIGNED_IN;
}

export async function POST(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const { done, value } = await request.json();
    const todo = await prisma.toDo.create({
      data: {
        ownerId: loggedInData.user?.id,
        done,
        value
      }
    });
    return NextResponse.json(todo);
  }
  return USER_NOT_SIGNED_IN;
}

