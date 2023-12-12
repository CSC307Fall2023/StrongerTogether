import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { USER_NOT_SIGNED_IN } from "@/lib/response";
import { checkLoggedIn } from "@/lib/auth";

async function createOrDeleteVotes(model, where, data) {
  // Step 1: Check if the record exists
  const record = await prisma[model].findUnique({
    where: {
      postId_userId: where,
    },
  });

  // Step 2: Create or Delete
  if (record) {
    // if user clicked on the same vote that they had made on a single post, just delete it
    if (record.type == data.type) {
      console.log(JSON.stringify({ DeletedData: data }, null, 2));
      return await prisma[model].delete({
        where: { postId_userId: where },
      });
    }
    // if they clicked on a different vote, update their vote on the post
    else {
      const updateData = await prisma[model].update({
        where: { postId_userId: where },
        data: data,
      });
      return updateData;
    }
  } else {
    // The record doesn't exist, so create it
    return await prisma[model].create({
      data: data,
    });
  }
}

// Not a good practice, but this POST api is for both creation and detion of votes
export async function POST(request) {
  const loggedInData = await checkLoggedIn(); // check user sign in
  if (loggedInData.loggedIn) {
    // if user is logged in, then create the event if needed
    const responseData = await request.json();
    const { voteType, postId } = responseData;
    // create data layout for post creation
    const checkVoteData = {
      userId: loggedInData.user.id,
      postId: postId,
    };

    console.log(checkVoteData);

    const newVoteData = {
      type: voteType,
      post: { connect: { id: postId } },
      user: { connect: { id: checkVoteData["userId"] } },
    };
    let votes;
    try {
      // like a toggle
      votes = await createOrDeleteVotes("Votes", checkVoteData, newVoteData);
    } catch (e) {
      console.log(e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    console.log(JSON.stringify(votes, null, 2));
    return NextResponse.json(votes);
  }
  return USER_NOT_SIGNED_IN;
}