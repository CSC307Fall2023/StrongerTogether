import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";
import { USER_NOT_SIGNED_IN } from "@/lib/response";

export async function POST(request) {
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    // if user is logged in, then create the event if needed
    const responseData = await request.json();
    const { name, location, startTime, endTime, maxAttendee } = responseData;
    const eventData = {
      eventName: name,
      location: location,
      startTime: startTime,
      endTime: endTime,
      maxAttendee: maxAttendee,
      hostId: loggedInData.user.id,
    };
    const events = await prisma.Event.create({ data: eventData });
    // simple console.log logger (need to add an actual logger in the future)
    console.log(events);
    return NextResponse.json(events);
  }
  return USER_NOT_SIGNED_IN;
}

export async function GET(request) {
	// send in GET request as query in URL
	const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    const { filters } = req.query;
		// if filters exist and if there is only one filter,
		// create an array of that filter
		if (filters && !Array.isArray(filters)) {
			filters = [filters]
		}
    let allEvents;
    if (filters.length > 0) {
      allEvents = await prisma.Event.findMany({
        where: {
          EventFilter: {
            some: {
              id: {
                in: filters,
              },
            },
          },
        },
        include: {
          filters: true,
        },
      });
    } else {
      // if no filter, return everything
      allEvents = await prisma.Event.findMany();
    }
    console.log(allEvents); // simple logger that logs out all the events and the filters
  }
  return USER_NOT_SIGNED_IN;
}
