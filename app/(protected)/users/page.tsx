import { Suspense } from "react";
import { verifyRole } from "@/lib/dataAccess";
import User from "@/modules/user/ui/User";
import { UserActions, UserTypes } from "@/modules/user/user.interface";
import { PagingType } from "@/lib/types";

async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: number | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    filter?: string | undefined;
    sort?: "asc" | "desc" | undefined;
  }>;
}) {
  const [, sp] = await Promise.all([verifyRole("admin"), searchParams]);
  const query = {
    page: Number(sp.page) || 1,
    limit: Number(sp.limit) || 10,
    search: sp.search || "",
    filter: sp.filter === "all" ? "" : sp.filter || "",
    sortOrder: sp.sort || "asc",
  } as UserTypes.ListUserQueryType;
  const result = (await UserActions.default.list(query)) as {
    data: { items: UserTypes.UserType[]; paging: PagingType };
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
        <User
          data={{
            users: result?.data?.items ?? [],
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

export default UsersPage;
