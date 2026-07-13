"use server";

import db from "@/lib/db";

export async function countUsers() {
  return await db.user.count();
}
