"use server";

import db from "@/lib/db";
import { Item } from "@/lib/generated/prisma/client";

export async function countProducts(userId: string): Promise<number> {
  return await db.item.count({
    where: { user_id: userId },
  });
}

export async function countLowStockProducts(userId: string): Promise<number> {
  return await db.item.count({
    where: { user_id: userId, stock: { lte: 5 } },
  });
}

export async function countOutOfStockProducts(userId: string): Promise<number> {
  return await db.item.count({
    where: { user_id: userId, stock: 0 },
  });
}

export async function latestProducts(userId: string): Promise<Item[]> {
  return await db.item.findMany({
    where: { user_id: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export async function lowStockProducts(userId: string): Promise<Item[]> {
  return await db.item.findMany({
    where: { user_id: userId, stock: { lte: 5 } },
    orderBy: { stock: "asc" },
    take: 5,
  });
}

export async function outOfStockProducts(userId: string): Promise<Item[]> {
  return await db.item.findMany({
    where: { user_id: userId, stock: 0 },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}
