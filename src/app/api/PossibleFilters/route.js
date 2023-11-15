import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkLoggedIn } from "@/lib/auth";
import { USER_NOT_SIGNED_IN } from "@/lib/response";

export async function GET(request) {
  try {
    // get all equipments
    const PossibleFilters = await prisma.PossibleFilters.findMany();
    return NextResponse.json(equipments);
  } catch (e) {
    NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const responseData = await request.json();
    const {filterType} = responseData;
    const equipments = await prisma.PossibleFilters.create({
      data: {
        filterType: filterType
      }
    });
    return NextResponse.json(equipments);
  } catch (e) {
    NextResponse.json({ error: e.message }, { status: 500 });
  }
}