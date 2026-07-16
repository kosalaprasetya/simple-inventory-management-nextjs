import Item from "@/modules/item/ui/Item";
import { ItemActions, ItemTypes } from "@/modules/item/item.interface";
import { CategoryAction } from "@/modules/category/category.interface";
import { getUser } from "@/lib/dataAccess";
import { PagingType } from "@/lib/types";
import { Suspense } from "react";

async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page: string;
    limit: string;
    search: string;
    filter: string;
    sort: string;
  }>;
}) {
  const [user, params] = await Promise.all([
    getUser() as Promise<{ data: { id: string } } | null>,
    searchParams,
  ]);
  const query = {
    userId: user?.data?.id || "",
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    search: params.search || "",
    filter: params.filter || "",
    sortOrder: params.sort || "asc",
  } as ItemTypes.ListItemQueryType;

  const [result, categoriesResult] = await Promise.all([
    ItemActions.default.listItems(query),
    CategoryAction.default.getCategories(),
  ]);

  const categories =
    (categoriesResult.data as { items: { id: string; label: string }[] })
      ?.items ?? [];

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <span>Loading...</span>
          </div>
        }
      >
        <Item
          data={{
            items: (result as { data: { items: ItemTypes.ItemType[] } })?.data
              ?.items ?? [],
            paging:
              (result as { data: { paging: PagingType } })?.data?.paging ?? {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
              },
          }}
          categories={categories}
        />
      </Suspense>
    </>
  );
}

export default ItemsPage;
