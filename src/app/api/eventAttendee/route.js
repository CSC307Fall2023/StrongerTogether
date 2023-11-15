import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";
import { USER_NOT_SIGNED_IN } from "@/lib/response";

export async function POST(request) {
  // const loggedInData = await checkLoggedIn();
  if (true) {
    // if user is logged in, then create the event if needed
    const responseData = await request.json();
    const { userId, eventId } = responseData;
    const eventAttendee = {
      user: { connect: { id: userId } },
      event: { connect: { id: eventId } },
    };
    console.log(eventAttendee);
    let EventAttendee;
    try {
      EventAttendee = await prisma.EventAttendee.create({ data: eventAttendee });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    // simple console.log logger (need to add an actual logger in the future)
    console.log(events);
    return NextResponse.json(EventAttendee);
  }
  return USER_NOT_SIGNED_IN;
}
