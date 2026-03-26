import { getProducts, getCategories } from "@/lib/ecommerce";
import { ProductCard } from "@/components/product-card";
import { Sparkles, SlidersHorizontal } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryId } = await searchParams;
  const products = await getProducts(categoryId);
  const categories = await getCategories();

  return (
    <div className="w-full">
      {/* Top bar — full bleed with inner padding */}
      <div className="w-full bg-white border-b border-black/5 px-4 sm:px-8 lg:px-12 xl:px-16 py-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-brand mb-1">
              <Sparkles size={13} />
              <span className="text-[9px] font-black uppercase tracking-[0.25em]">New Arrivals</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-[#111] uppercase">
              THE <span className="text-brand">COLLECTION</span>
            </h1>
          </div>
          <p className="text-sm text-[#888] font-medium max-w-xs hidden sm:block">
            Try any item in our AI Studio before buying.
          </p>
        </div>

        {/* Categories Filter — horizontal scroll */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
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
      </div>

      {/* Product Grid — full width with responsive padding */}
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-6">
        {products.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#888]">
                {products.length} Products
              </p>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-[#888] uppercase tracking-widest">
                <SlidersHorizontal size={11} /> Sort
              </div>
            </div>
            {/* 2 → 3 → 4 → 5 → 6 column responsive grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 flex flex-col items-center gap-4 border border-dashed border-black/10 rounded-2xl bg-white">
            <p className="text-[#888] font-bold text-xs uppercase tracking-widest">No items found</p>
            <a href="/shop" className="text-brand font-black uppercase text-[10px] tracking-widest hover:underline">
              Clear Filters
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
