"use server";

import { getUser } from "@/lib/dataAccess";
import db from "@/lib/db";

export async function countCategories() {
  return await db.category.count();
}

export async function mostPopularCategories() {
  const { data } = await getUser();
  const user = data as { id: string };

  // Group items by category_id, count per category, take top 5
  const groups = await db.item.groupBy({
    by: ["category_id"],
    where: { user_id: user.id },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });

  // Resolve category_id → label
  const categoryIds = groups.map((g) => g.category_id);
  const categories = await db.category.findMany({
    where: { id: { in: categoryIds } },
  });
  const labelMap = Object.fromEntries(categories.map((c) => [c.id, c.label]));

  return groups.map((g) => ({
    categoryId: g.category_id,
    label: labelMap[g.category_id] || "Unknown",
    count: g._count.id,
  }));
}
