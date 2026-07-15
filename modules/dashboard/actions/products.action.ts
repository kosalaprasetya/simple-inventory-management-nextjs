"use server";

import db from "@/lib/db";
import { getUser } from "@/lib/dataAccess";
import { ResponseType } from "@/lib/types";
import { Item } from "@/lib/generated/prisma/client";

async function getUserId(): Promise<string> {
  const userData = (await getUser()) as { data: { id: string } };
  return userData?.data?.id;
}

export async function countProducts(): Promise<number> {
  const userId = await getUserId();
  return await db.item.count({
    where: { user_id: userId },
  });
}

export async function countLowStockProducts(): Promise<number> {
  const userId = await getUserId();
  return await db.item.count({
    where: { user_id: userId, stock: { lte: 5 } },
  });
}

export async function countOutOfStockProducts(): Promise<number> {
  const userId = await getUserId();
  return await db.item.count({
    where: { user_id: userId, stock: 0 },
  });
}

export async function latestProducts(): Promise<Item[]> {
  const userId = await getUserId();
  return await db.item.findMany({
    where: { user_id: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export async function lowStockProducts(): Promise<Item[]> {
  const userId = await getUserId();
  return await db.item.findMany({
    where: { user_id: userId, stock: { lte: 5 } },
    orderBy: { stock: "asc" },
    take: 5,
  });
}

export async function outOfStockProducts(): Promise<Item[]> {
  const userId = await getUserId();
  return await db.item.findMany({
    where: { user_id: userId, stock: 0 },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}
