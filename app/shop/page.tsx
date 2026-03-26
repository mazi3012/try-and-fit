import { getProducts, getCategories } from "@/lib/ecommerce";
import { ProductCard } from "@/components/product-card";
import { Sparkles } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryId } = await searchParams;
  const products = await getProducts(categoryId);
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-8 py-6">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-brand">
          <Sparkles size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.25em]">New Arrivals</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#111] uppercase">
          THE <span className="text-brand">COLLECTION</span>
        </h1>
        <p className="max-w-xl text-[#888] text-sm font-medium">
          Browse our curated catalog. Try any item instantly in our AI studio before making your move.
        </p>
      </header>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <a
          href="/shop"
          className={`flex-shrink-0 px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
            !categoryId
              ? "bg-[#111] text-white border-[#111]"
              : "border-black/15 text-[#888] bg-white hover:border-black/40"
          }`}
        >
          All
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/shop?category=${cat.id}`}
            className={`flex-shrink-0 px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
              categoryId === cat.id
                ? "bg-[#111] text-white border-[#111]"
                : "border-black/15 text-[#888] bg-white hover:border-black/40"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center gap-4 border border-dashed border-black/10 rounded-2xl bg-white">
          <p className="text-[#888] font-bold text-xs uppercase tracking-widest">No items found</p>
          <a href="/shop" className="text-brand font-black uppercase text-[10px] tracking-widest hover:underline">
            Clear Filters
          </a>
        </div>
      )}
    </div>
  );
}
