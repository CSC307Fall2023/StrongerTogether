import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";

export async function GET(request, { params }) {
  const loggedInData = await checkLoggedIn();
  const forumId = parseInt(params.id);
  let forum;
  if (loggedInData.loggedIn && forumId) {
    console.log("finding", { id, done, value, ownerId: loggedInData.user.id });
    try {
      forum = await prisma.$queryRaw`
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
          ),
          "Comments" AS (
            SELECT
          )
        SELECT "total_votes".*, "filters"."filters", "User"."name"
        FROM "total_votes"
        WHERE "total_votes"."id" = ${forumId}
        LEFT JOIN "filters" ON "total_votes"."id" = "filters"."postId"
        JOIN "User" ON "User"."id" = "total_votes"."authorId"
      `;
      return NextResponse.json(todo);
    } catch {
      return NextResponse.json({ error: "record not found" }, { status: 401 });
    }
  }
  return NextResponse.json({ error: "not signed in" }, { status: 403 });
}

export async function PUT(request, { params }) {
  const loggedInData = await checkLoggedIn();
  const id = parseInt(params.id);
  if (loggedInData.loggedIn && id) {
    const { value, done } = await request.json();
    console.log("finding", { id, done, value, ownerId: loggedInData.user.id });
    try {
      const todo = await prisma.toDo.update({
        where: {
          id,
          ownerId: loggedInData.user.id,
        },
        data: {
          value,
          done,
        },
      });
      return NextResponse.json(todo);
    } catch {
      return NextResponse.json({ error: "record not found" }, { status: 401 });
    }
  }
  return NextResponse.json({ error: "not signed in" }, { status: 403 });
}

export async function DELETE(request, { params }) {
  const loggedInData = await checkLoggedIn();
  const id = +params.id;
  if (loggedInData.loggedIn && id) {
    const todo = await prisma.Post.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ deleted: todo });
  }
  return NextResponse.json({ error: "not signed in" }, { status: 403 });
}
