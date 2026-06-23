import Item from "@/modules/item/ui/Item";
import { ItemActions, ItemTypes } from "@/modules/item/item.interface";
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
  const user = (await getUser()) as { data: { id: string } } | null;
  const params = await searchParams;
  const query = {
    userId: user?.data?.id || "",
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    search: params.search || "",
    filter: params.filter || "",
    sortOrder: params.sort || "asc",
  } as ItemTypes.ListItemQueryType;
  const result = (await ItemActions.default.listItems(query)) as {
    data: { items: ItemTypes.ItemType[]; paging: PagingType };
  };
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
            items: result?.data?.items ?? [],
            paging: result?.data?.paging ?? {
              currentPage: 1,
              totalPages: 0,
              totalItems: 0,
            },
          }}
        />
      </Suspense>
    </>
  );
}

export default ItemsPage;
