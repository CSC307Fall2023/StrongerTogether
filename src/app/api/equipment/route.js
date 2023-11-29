import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // get all equipments
    const equipments = await prisma.Equipments.findMany();
    return NextResponse.json(equipments);
  } catch (e) {
    NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const responseData = await request.json();
  const { equipmentName, short_description, long_description, image_path } =
    responseData;
  let newEquipment;
  try {
    newEquipment = await prisma.Equipments.create({
      data: {
        equipmentName,
        short_description,
        long_description,
        image_path
      }
    });
  } catch (e) {
    console.log(e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  console.log(newEquipment)
  return NextResponse.json(newEquipment)
}
