import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";
import { USER_NOT_SIGNED_IN } from "@/lib/response";
import { RiceBowl } from "@mui/icons-material";

async function check_friends_exist(currentUserId, friendId) {
  // checks in both initiator and recipient to see if they're already friends or not
  try {
    // try finding them in initiator:
    const userAsInitiator = await prisma.Friendship.findUnique({
      where: {
        initiatorId_recipientId: {
          initiatorId: currentUserId,
          recipientId: friendId,
        }
      },
    });
    console.log("userAsInitiator", userAsInitiator)
    if (userAsInitiator) return { type: "initiator" }; // user is initiator of friendId
    const userAsRecipient = await prisma.Friendship.findUnique({
      where: {
        initiatorId_recipientId: {
          initiatorId: friendId,
          recipientId: currentUserId,
        }
      },
    });
    console.log("userAsRecipient", userAsInitiator)
    if (userAsRecipient) return { type: "recipient" }; // user is recipient of friendId
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  return null; // they're not friends
}

export async function POST(request) {
  // POST request to add friends
  // const loggedInData = await checkLoggedIn();
  if (true) {
    // if user is logged in, then create the event if needed
    const userId = 1;
    const responseData = await request.json();
    const { friendId } = responseData;
    responseData;
    const friendshipData = {
      initiatorId: userId,
      recipientId: friendId,
    };
    console.log("recipient", friendId);
    console.log(friendshipData);
    try {
      // check if they're already friends so they don't have duplicated records in Friendship table.
      const check_exist = await check_friends_exist(userId, friendId);
      // console.log(check_exist)
      if (check_exist === null) {
        const friendship = await prisma.Friendship.create({
          data: friendshipData,
        });
        console.log(friendship);
        return NextResponse.json({ ...friendship, message: "Request Sent :)" });
      } else {
        return NextResponse.json({ message: "Already Pending or Friends" });
      }
    } catch (e) {
      console.log(e);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  return USER_NOT_SIGNED_IN;
}

// export async function GET(request) {
//   // send in GET request as query in URL
//   const loggedInData = await checkLoggedIn();
//   // const { id } = router.query;
//   if (loggedInData.loggedIn) {
//     const searchParams = request.nextUrl.searchParams;
//     // Get all 'filters' query parameters as an array
//     let status = searchParams.get("status");
//     const userId = loggedInData.user.id;
//     console.log(userId)
//     let friends;
//     try {
//       switch(status) {
//         // check all pending of recipient for the current user. So only the current user can see their incoming friend request
//         case "PENDING":
//           friends = await prisma.Friendship.findMany({
//             where: {
//                 recipientId: userId,
//                 status,
//             },
//           });
//           break;
//         // get back all related friends of either initiator or recipient that have an accepted status
//         case "ACCEPTED":
//           friends = await prisma.$queryRaw`
//             WITH 
//               "AcceptedFriends" AS (
//                 (
//                   SELECT "recipientId" AS "Friends"
//                   FROM "Friendship"
//                   WHERE "initiatorId" = ${userId} AND "status" = 'ACCEPTED'
//                 )
//                 UNION
//                 (                
//                   SELECT "initiatorId" AS "Friends"
//                   FROM "Friendship"
//                   WHERE "recipientId" = ${userId} AND "status" = 'ACCEPTED'
//                 )
//               )
//             SELECT "User"."name", "AcceptedFriends"."Friends"
//             FROM "AcceptedFriends"
//             JOIN "User" ON "User"."id" = "AcceptedFriends"."Friends"
//           `;
//           break;
//         default:
//           // Grab all users who are not currently pending or accepted
//           friends = await prisma.$queryRaw`
//             WITH 
//               "FriendsOngoing" AS (
//                 (
//                   SELECT "recipientId" AS "Friends"
//                   FROM "Friendship"
//                   WHERE "initiatorId" = ${userId}
//                 )
//                 UNION
//                 (                
//                   SELECT "initiatorId" AS "Friends"
//                   FROM "Friendship"
//                   WHERE "recipientId" = ${userId}
//                 )
//               )
//             SELECT "User"."id", "User"."name", "User"."status", "User"."ProfileImage" as "image"
//             FROM "User"
//             WHERE "User"."id" NOT IN (SELECT "Friends" FROM "FriendsOngoing") AND "User"."id" != ${userId};
//           `;
//         break;
//       }
//     } catch (e) {
//       console.log(e.message);
//       return NextResponse.json({ error: e.message }, { status: 500 });
//     }
//     console.log(JSON.stringify(friends, null, 2)); // simple logger that logs out all the events and the filters
//     return NextResponse.json(friends);
//   }
//   return USER_NOT_SIGNED_IN;
// }

export async function PUT(request) {
  // This HTTP PUT request is used to update status of friendship. So update to accept
  // const loggedInData = await checkLoggedIn();
  if (true) {
    const responseData = await request.json();
    const userId = 2;
    const { initiatorId } = responseData; // Need the initiator id in ordre to acecpt them as friends
    const friendRequestAcceptedBy = {
      initiatorId_recipientId: {
        initiatorId,
        recipientId: userId,
      }
    };
    let acceptedFriend;
    try {
      acceptedFriend = await prisma.Friendship.update({
        where: {
          ...friendRequestAcceptedBy,
        },
        data: {
          status: "ACCEPTED",
        },
      });
    } catch (e) {
      console.log(e.message);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json(acceptedFriend);
  }
  return USER_NOT_SIGNED_IN;
}

export async function DELETE(request) {
  // delete friendship
  // const loggedInData = await checkLoggedIn();
  if (true) {
    const responseData = await request.json();
    const userId = 1;
    const { friendId } = responseData;
    let unfriend
    try {
      const check_exist = await check_friends_exist(userId, friendId);
      // check both as initiator and as recipient
      if (check_exist && check_exist.type === "initiator") {
        const friendToDeleteAsInitiator = {
          initiatorId_recipientId: {
            initiatorId: userId,
            recipientId: friendId,
          }
        };
        unfriend = await prisma.Friendship.delete({
          where: {
            ...friendToDeleteAsInitiator,
          },
        });
        unfriend.message = "Friend Deleted :("
      }
      // if the friendship is as a recipient, delete it as recipient
      if (check_exist && check_exist.type === "recipient") {
        const friendsToDeleteAsRecipient = {
          initiatorId_recipientId: {
            initiatorId: friendId,
            recipientId: userId,
          }
        };
        unfriend = await prisma.Friendship.delete({
          where: {
            ...friendsToDeleteAsRecipient,
          },
        });
        unfriend.message = "Friend Deleted :("
      }

      if (check_exist === null) {
        unfriend = {
          message: "No Friends to Delete"
        }
      }
    } catch (e) {
      console.log(e.message);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json(unfriend);
  }
  return USER_NOT_SIGNED_IN;
}
