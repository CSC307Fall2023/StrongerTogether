import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";
import { USER_NOT_SIGNED_IN } from "@/lib/response";

async function createOrDeleteAttendee(model, where, data) {
  // Step 1: Check if the record exists
  const record = await prisma[model].findUnique({
    where: {
      eventId_userId: where,
    },
  });
  let createOrDelete;
  // Step 2: Create or Delete
  if (record) {
    // if user clicked on the same event post interest, then delete it
    createOrDelete = await prisma[model].delete({
      where: { eventId_userId: where },
    });
    createOrDelete.type = "delete";
  } else {
    // The record doesn't exist, so create it
    createOrDelete = await prisma[model].create({
      data: data,
    });
    createOrDelete.type = "create";
  }
  return createOrDelete;
}

export async function POST(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    // if user is logged in, then create the event if needed
    const userId = loggedInData.user.id
    const responseData = await request.json();
    const { eventId } = responseData;
    const newEventAttendee = {
      user: { connect: { id: userId } },
      event: { connect: { id: eventId } },
    };
    const checkVoteData = {
      userId: loggedInData.user.id,
      eventId: eventId,
    };
    console.log(newEventAttendee);
    let EventAttendee;
    try {
      EventAttendee = await createOrDeleteAttendee("EventAttendee", checkVoteData, newEventAttendee);
    } catch (e) {
      console.log(e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    // simple console.log logger (need to add an actual logger in the future)
    console.log(EventAttendee);
    return NextResponse.json(EventAttendee);
  }
  return USER_NOT_SIGNED_IN;
}