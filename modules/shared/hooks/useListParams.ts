"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useCallback } from "react";

type UseListParamsOptions = {
  basePath: string;
  initialExtraParams?: Record<string, string>;
};

export default function useListParams({
  basePath,
  initialExtraParams = {},
}: UseListParamsOptions) {
  const router = useRouter();
  const params = useSearchParams();

  const sort = (params.get("sort") as "asc" | "desc") || "asc";
  const page = Number(params.get("page")) || 1;
  const [search, setSearch] = useState(params.get("search") || "");
  const [extraParams, setExtraParams] = useState(initialExtraParams);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildUrl = useCallback(
    (searchVal: string, sortVal: string, pageVal: string, extra: Record<string, string>) => {
      const sp = new URLSearchParams();
      sp.set("search", searchVal);
      sp.set("sort", sortVal);
      sp.set("page", pageVal);
      sp.set("limit", "10");
      for (const [key, value] of Object.entries(extra)) {
        if (value) sp.set(key, value);
      }
      return `${basePath}?${sp.toString()}`;
    },
    [basePath],
  );

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(
        () => router.replace(buildUrl(value, sort, "1", extraParams)),
        800,
      );
    },
    [router, buildUrl, sort, extraParams],
  );

  const toggleSort = useCallback(() => {
    clearTimeout(debounceTimer.current);
    const nextSort = sort === "asc" ? "desc" : "asc";
    router.replace(buildUrl(search, nextSort, "1", extraParams));
  }, [router, buildUrl, search, sort, extraParams]);

  const goToPage = useCallback(
    (n: number) => {
      clearTimeout(debounceTimer.current);
      router.replace(buildUrl(search, sort, String(n), extraParams));
    },
    [router, buildUrl, search, sort, extraParams],
  );

  const setExtraParam = useCallback(
    (key: string, value: string) => {
      setExtraParams((prev) => {
        const next = { ...prev, [key]: value };
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(
          () => router.replace(buildUrl(search, sort, "1", next)),
          800,
        );
        return next;
      });
    },
    [router, buildUrl, search, sort],
  );

  return { sort, page, search, extraParams, onSearch, toggleSort, goToPage, setExtraParam };
}
