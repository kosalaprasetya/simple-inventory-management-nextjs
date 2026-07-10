import { Suspense } from "react";
import Category from "@/modules/category/ui/Category";
import { CategoryAction, CategoryTypes } from "@/modules/category/category.interface";
import type { PagingType } from "@/lib/types";

async function CategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: "asc" | "desc"; search?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const query = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    sortOrder: params.sort || "asc",
    search: params.search || "",
  };
  const result = (await CategoryAction.default.getCategories(query)) as {
    data: { items: CategoryTypes.CategoryType[]; paging: PagingType };
  };

  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><span>Loading...</span></div>}>
      <Category
        data={{
          categories: result?.data?.items ?? [],
          paging: result?.data?.paging ?? { currentPage: 1, totalPages: 0, totalItems: 0 },
        }}
      />
    </Suspense>
  );
}

export default CategoryPage;
