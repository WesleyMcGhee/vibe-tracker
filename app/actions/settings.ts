"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertSetting(key: string, value: string) {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath("/settings");
}

export async function saveSettings(formData: FormData) {
  const keys = ["businessName", "businessAddress", "businessPhone", "businessEmail"];
  for (const key of keys) {
    const value = (formData.get(key) as string) ?? "";
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  revalidatePath("/settings");
}

export async function getSettings(): Promise<Record<string, string>> {
  const settings = await prisma.setting.findMany();
  return Object.fromEntries(settings.map((s: { key: string; value: string }) => [s.key, s.value]));
}
