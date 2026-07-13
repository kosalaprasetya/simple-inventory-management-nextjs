"use server";

import db from "@/lib/db";
import { getUser } from "@/lib/dataAccess";
import { ResponseType } from "@/lib/types";
import { Item } from "@/lib/generated/prisma/client";

const user = async () => (await getUser()) as ResponseType;
const userData = (await user()) as { data: { id: string } };
const userId = userData?.data?.id;

export async function countProducts(): Promise<number> {
  return await db.item.count({
    where: { user_id: userId },
  });
}

export async function countLowStockProducts(): Promise<number> {
  return await db.item.count({
    where: { user_id: userId, stock: { lte: 5 } },
  });
}

export async function countOutOfStockProducts(): Promise<number> {
  return await db.item.count({
    where: { user_id: userId, stock: 0 },
  });
}

export async function latestProducts(): Promise<Item[]> {
  return await db.item.findMany({
    where: { user_id: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export async function lowStockProducts(): Promise<Item[]> {
  return await db.item.findMany({
    where: { user_id: userId, stock: { lte: 5 } },
    orderBy: { stock: "asc" },
    take: 5,
  });
}

export async function outOfStockProducts(): Promise<Item[]> {
  return await db.item.findMany({
    where: { user_id: userId, stock: 0 },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}
