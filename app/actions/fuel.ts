"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createFuelEntry(formData: FormData) {
  const dateStr = formData.get("date") as string;
  const gallons = parseFloat(formData.get("gallons") as string);
  const cost = parseFloat(formData.get("cost") as string);
  const notes = (formData.get("notes") as string) || null;

  if (!dateStr || isNaN(gallons) || isNaN(cost)) throw new Error("Invalid fuel entry data");

  await prisma.fuelEntry.create({
    data: {
      date: new Date(dateStr),
      gallons,
      cost,
      notes,
    },
  });

  revalidatePath("/fuel");
}

export async function deleteFuelEntry(id: string) {
  await prisma.fuelEntry.delete({ where: { id } });
  revalidatePath("/fuel");
}
