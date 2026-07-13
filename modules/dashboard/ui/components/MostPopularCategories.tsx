import { Tag } from "lucide-react";

type CategoryStat = {
  categoryId: string;
  label: string;
  count: number;
};

const BAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
];

const MostPopularCategories = ({
  categories,
}: {
  categories: CategoryStat[];
}) => {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <Tag width={32} height={32} className="mb-2 opacity-40" />
        <p>No category data yet</p>
      </div>
    );
  }

  const maxCount = Math.max(...categories.map((c) => c.count));

  return (
    <div className="flex flex-col gap-3">
      {categories.map((cat, i) => {
        const widthPercent = maxCount > 0 ? (cat.count / maxCount) * 100 : 0;
        return (
          <div key={cat.categoryId} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-200">{cat.label}</span>
              <span className="tabular-nums text-gray-400">
                {cat.count} {cat.count === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
              <div
                className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]} transition-all duration-500`}
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MostPopularCategories;
