"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPayPeriod(clientId: string, formData: FormData) {
  const startDateStr = formData.get("startDate") as string;
  const duration = formData.get("duration") as string;

  if (!startDateStr || !duration) throw new Error("Invalid pay period data");

  const startDate = new Date(startDateStr);
  const endDate = new Date(startDate);

  switch (duration) {
    case "1_week":
      endDate.setDate(startDate.getDate() + 6);
      break;
    case "2_weeks":
      endDate.setDate(startDate.getDate() + 13);
      break;
    case "1_month":
      endDate.setMonth(startDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1);
      break;
  }

  const period = await prisma.payPeriod.create({
    data: { clientId, startDate, endDate, status: "active" },
  });

  revalidatePath(`/clients/${clientId}`);
  redirect(`/clients/${clientId}/pay-periods/${period.id}`);
}

export async function archivePayPeriod(id: string, clientId: string) {
  await prisma.payPeriod.update({
    where: { id },
    data: { status: "archived" },
  });

  revalidatePath(`/clients/${clientId}`);
}

export async function activatePayPeriod(id: string, clientId: string) {
  await prisma.payPeriod.update({
    where: { id },
    data: { status: "active" },
  });

  revalidatePath(`/clients/${clientId}`);
}

export async function deletePayPeriod(id: string, clientId: string) {
  await prisma.payPeriod.delete({ where: { id } });
  revalidatePath(`/clients/${clientId}`);
  redirect(`/clients/${clientId}`);
}
