"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEntry(payPeriodId: string, clientId: string, formData: FormData) {
  const dateStr = formData.get("date") as string;
  const riders = parseInt(formData.get("riders") as string);
  const shift = formData.get("shift") as string;
  const extras = parseFloat(formData.get("extras") as string) || 0;
  const notes = (formData.get("notes") as string) || null;

  if (!dateStr || isNaN(riders) || !shift) throw new Error("Invalid entry data");

  await prisma.entry.create({
    data: {
      payPeriodId,
      date: new Date(dateStr),
      riders,
      shift,
      extras,
      notes,
    },
  });

  revalidatePath(`/clients/${clientId}/pay-periods/${payPeriodId}`);
}

export async function updateEntry(
  id: string,
  payPeriodId: string,
  clientId: string,
  formData: FormData
) {
  const dateStr = formData.get("date") as string;
  const riders = parseInt(formData.get("riders") as string);
  const shift = formData.get("shift") as string;
  const extras = parseFloat(formData.get("extras") as string) || 0;
  const notes = (formData.get("notes") as string) || null;

  await prisma.entry.update({
    where: { id },
    data: {
      date: new Date(dateStr),
      riders,
      shift,
      extras,
      notes,
    },
  });

  revalidatePath(`/clients/${clientId}/pay-periods/${payPeriodId}`);
}

export async function deleteEntry(id: string, payPeriodId: string, clientId: string) {
  await prisma.entry.delete({ where: { id } });
  revalidatePath(`/clients/${clientId}/pay-periods/${payPeriodId}`);
}
