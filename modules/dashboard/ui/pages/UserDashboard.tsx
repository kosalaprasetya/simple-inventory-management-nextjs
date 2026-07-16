import {
  AlertTriangle,
  Inbox,
  Layers,
  Package,
  PackageOpen,
  TrendingDown,
} from "lucide-react";
import {
  countCategories,
  mostPopularCategories,
} from "../../actions/categories.action";
import {
  countLowStockProducts,
  countOutOfStockProducts,
  countProducts,
  latestProducts,
  lowStockProducts,
  outOfStockProducts,
} from "../../actions/products.action";
import MostPopularCategories from "../components/MostPopularCategories";

const UserDashboard = async ({ userId }: { userId: string }) => {
  const [
    totalProductsCount,
    lowStockCount,
    outOfStockCount,
    categoriesCount,
    latestProductsData,
    popularCategoriesData,
    lowStockProductsData,
    outOfStockProductsData,
  ] = await Promise.all([
    countProducts(userId),
    countLowStockProducts(userId),
    countOutOfStockProducts(userId),
    countCategories(),
    latestProducts(userId),
    mostPopularCategories(userId),
    lowStockProducts(userId),
    outOfStockProducts(userId),
  ]);

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KEY METRICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl bg-gray-800 p-5">
          <div className="rounded-lg bg-blue-500/15 p-3">
            <Package width={24} height={24} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Products</p>
            <p className="text-2xl font-bold">{totalProductsCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-gray-800 p-5">
          <div className="rounded-lg bg-amber-500/15 p-3">
            <TrendingDown width={24} height={24} className="text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Low Stock</p>
            <p className="text-2xl font-bold">{lowStockCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-gray-800 p-5">
          <div className="rounded-lg bg-rose-500/15 p-3">
            <PackageOpen width={24} height={24} className="text-rose-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Out of Stock</p>
            <p className="text-2xl font-bold">{outOfStockCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-gray-800 p-5">
          <div className="rounded-lg bg-violet-500/15 p-3">
            <Layers width={24} height={24} className="text-violet-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Categories</p>
            <p className="text-2xl font-bold">{categoriesCount}</p>
          </div>
        </div>
      </div>

      {/* LATEST PRODUCTS + POPULAR CATEGORIES */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-gray-800 p-5 lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">Latest Products</h2>
          {latestProductsData.length === 0 ? (
            <p className="py-4 text-center text-gray-500">No products yet</p>
          ) : (
            <div className="flex flex-col gap-1">
              {latestProductsData.map((product, i) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-700 text-xs font-medium text-gray-300">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-200">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 tabular-nums">
                    Stock: {product.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl bg-gray-800 p-5">
          <h2 className="mb-3 text-lg font-semibold">Popular Categories</h2>
          <MostPopularCategories categories={popularCategoriesData} />
        </div>
      </div>

      {/* LOW STOCK + OUT OF STOCK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-800 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle width={18} height={18} className="text-amber-400" />
            <h2 className="text-lg font-semibold">Low Stock</h2>
          </div>
          {lowStockProductsData.length === 0 ? (
            <p className="py-4 text-center text-gray-500">
              All products are well stocked
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {lowStockProductsData.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-700/50"
                >
                  <span className="text-sm text-gray-200">{product.name}</span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                      product.stock === 0
                        ? "bg-rose-500/15 text-rose-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {product.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl bg-gray-800 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Inbox width={18} height={18} className="text-rose-400" />
            <h2 className="text-lg font-semibold">Out of Stock</h2>
          </div>
          {outOfStockProductsData.length === 0 ? (
            <p className="py-4 text-center text-gray-500">
              No products out of stock
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {outOfStockProductsData.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-700/50"
                >
                  <span className="text-sm text-gray-200">{product.name}</span>
                  <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-xs font-medium text-rose-400">
                    {product.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
