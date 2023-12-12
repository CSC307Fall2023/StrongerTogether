import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { USER_NOT_SIGNED_IN } from "@/lib/response";
import { checkLoggedIn } from "@/lib/auth";

export async function POST(request) {
  const loggedInData = await checkLoggedIn(); // check user sign in
  if (loggedInData.loggedIn) {
    // if user is logged in, then create the event if needed
    const responseData = await request.json();
    const { postId, possibleFilterId } = responseData;
    // create a postFilter and connect it to the post and possibleFilters
    const postFilterData = {
      post: { connect: { id: postId } },
      possibleFilter: { connect: { id: possibleFilterId } },
    };
    console.log(postFilterData);
    let postFilter;
    try {
      postFilter = await prisma.PostFilters.create({ data: postFilterData });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    console.log(JSON.stringify(postFilter, null, 2));
    return NextResponse.json(postFilter);
  }
  return USER_NOT_SIGNED_IN;
}

export async function GET(request) {
  // send in GET request as query in URL
  const loggedInData = await checkLoggedIn();
  if (loggedInData.loggedIn) {
    // const searchParams = request.nextUrl.searchParams;
    // Get all 'filters' query parameters as an array
    // let filters = searchParams.getAll("filters");
    // filters = filters.map((value) => parseInt(value));
    // console.log(filters)
    let forums;
    const filtersArrayString = `{${filters.join(',')}}`;
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
            SELECT p1."postId", array_agg(
              json_build_object(
                'FilterId', "PossibleFilters"."id",
                'FilterName', "PossibleFilters"."filterType"
                )) AS "filters"
            FROM "PostFilters" p1
            JOIN "PossibleFilters" ON "possibleFilterId" = "PossibleFilters"."id"
            -- For the current filter, check if all of the filter for the postId is in the array of filterIds
            WHERE (
              SELECT count(DISTINCT p2."possibleFilterId")
              FROM "PostFilters" p2
              WHERE p2."postId" = p1."postId"
              AND p2."possibleFilterId" = ANY(${filters}::bigint[])
            ) = array_length(${filters}::bigint[], 1)
            -- WHERE EXISTS (
            --   SELECT 1
            --   FROM "PostFilters" p2
            --   WHERE p1."postId" = p2."postId" AND p2."possibleFilterId" = ANY (${filters}::bigint[])
            -- )
            -- Group by the postId so that you can make it into an aggregated array of similar json elements
            GROUP BY p1."postId"
          )
        SELECT "total_votes".*, "filters"."filters"
        FROM "total_votes"
        JOIN "filters" ON "total_votes"."id" = "filters"."postId"
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
