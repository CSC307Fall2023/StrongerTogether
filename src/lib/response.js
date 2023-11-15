import { NextResponse } from "next/server";
/* Util file for common responses and messages */

export const USER_NOT_SIGNED_IN = NextResponse.json({error: 'not signed in'}, {status: 403});
