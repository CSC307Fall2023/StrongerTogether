import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from 'bcryptjs';
import { USER_NOT_SIGNED_IN } from "@/lib/response";
import { checkLoggedIn } from "@/lib/auth";

export async function PUT(request, { params }) {
  // delete events and cascade delete all the event attendees
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const responseData = await request.json();
    const {
      name, shortBio, photo, ProfileImage
    } = responseData;
    const eventData = {
      name, shortBio, photo, ProfileImage
    };
    let updatedUser;
    try {
      updatedEvent = await prisma.Event.update({
        where: {
          id,
        },
        data: eventData,
      });
      console.log(deletedFilters);
      console.log(updatedEvent);
    } catch (e) {
      console.log(e.message);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json(updatedEvent);
  }
  return USER_NOT_SIGNED_IN;
}
