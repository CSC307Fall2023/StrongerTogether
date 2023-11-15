import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(request, { params }) {
  const id = parseInt(params.id);
  console.log(id)
  let deletedEquipment;
  try {
    deletedEquipment = await prisma.Equipments.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    console.log(e.message)
    return NextResponse.json({error: e.message}, {status: 500})
  }
  console.log(deletedEquipment);
  return NextResponse.json(deletedEquipment);
}
