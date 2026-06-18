"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(formData: FormData) {
  const name = formData.get("name") as string;
  const rate = parseInt(formData.get("rate") as string);

  if (!name || isNaN(rate)) throw new Error("Invalid client data");

  const client = await prisma.client.create({ data: { name, rate } });

  revalidatePath("/clients");
  redirect(`/clients/${client.id}`);
}

export async function updateClient(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const rate = parseInt(formData.get("rate") as string);

  if (!name || isNaN(rate)) throw new Error("Invalid client data");

  await prisma.client.update({ where: { id }, data: { name, rate } });

  revalidatePath(`/clients/${id}`);
  revalidatePath("/clients");
}

export async function deleteClient(id: string) {
  await prisma.client.delete({ where: { id } });
  revalidatePath("/clients");
  redirect("/clients");
}
