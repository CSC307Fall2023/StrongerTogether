import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { USER_NOT_SIGNED_IN } from "@/lib/response";
import { checkLoggedIn } from "@/lib/auth";

/* 
  postTitle       String
  postDescription String
  authorId        Int
  author          User          @relation(fields: [authorId], references: [id])
*/

export async function POST(request) {
  // const loggedInData = await checkLoggedIn(); // check user sign in
  if (true) {
    // if user is logged in, then create the event if needed
    const responseData = await request.json();
    const { postTitle, postDescription, filterIds } = responseData;
    // create data layout for post creation
    const postData = {
      postTitle: postTitle,
      postDescription: postDescription,
      authorId: 1, // change this to something more dynamic
      PostFilters: {
        create: filterIds.map((id) => ({
          possibleFilter: {
            connect: {
              id: id,
            },
          },
        })),
      },
    };
    console.log(postData);
    let events;
    try {
      events = await prisma.Post.create({ data: postData });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    console.log(JSON.stringify(postData, null, 2));
    return NextResponse.json(postData);
  }
  return USER_NOT_SIGNED_IN;
}

export async function GET(request) {
  // send in GET request as query in URL
  // const loggedInData = await checkLoggedIn();
  // Optimize this with SQL later :))
  if (true) {
    let forums;
    try {
      forums = await prisma.$queryRaw`
        WITH 
          -- Gets the number of upvotes to be summed
          "upvote" AS (
            SELECT "Votes"."postId", CAST(count(*) AS INTEGER) as total_upvote
            FROM "Votes"
            WHERE "Votes"."type" = 'UPVOTE'
            GROUP BY "Votes"."postId"
          ),
          -- Gets the number of downvotes to be summed
          "downvote" AS (
            SELECT "Votes"."postId", CAST(count(*) AS INTEGER) as total_downvote
            FROM "Votes"
            WHERE "Votes"."type" = 'DOWNVOTE'
            GROUP BY "Votes"."postId"
          ),
          -- Create the aggregate table by joining upvotes, downvotes, and post
          "aggregated_table" AS (
            SELECT *
            FROM "Post"
            LEFT JOIN "upvote" ON "Post"."id" = "upvote"."postId"
            LEFT JOIN "downvote" ON "Post"."id" = "downvote"."postId"
          ),
          -- For each row (i.e. each post), subtract total_upvotes by total_downvotes. If upvotes - downvotes < 0, make it 0
          "total_votes" AS (
            SELECT *, COALESCE(total_upvote, 0) - COALESCE(total_downvote, 0) AS total_vote
            FROM "aggregated_table"
          ),
          -- Get all the filters for a certain post (i.e. an array of PostFilters) and make each element as json object with filterId and filterName as attributes
          "filters" AS (
            SELECT "PostFilters"."postId", array_agg(
              json_build_object(
                'FilterId', "PossibleFilters"."id",
                'FilterName', "PossibleFilters"."filterType"
                )) AS "filters"
            FROM "PostFilters"
            JOIN "PossibleFilters" ON "possibleFilterId" = "PossibleFilters"."id"
            GROUP BY "PostFilters"."postId"
          )
        SELECT "total_votes".*, "filters"."filters"
        FROM "total_votes"
        LEFT JOIN "filters" ON "total_votes"."id" = "filters"."postId"
      `;
    } catch (e) {
      console.log(e.message);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    console.log(JSON.stringify(forums, null, 2)); // simple logger that logs out all the events and the filters
    return NextResponse.json(forums);
  }
  return USER_NOT_SIGNED_IN;
}
