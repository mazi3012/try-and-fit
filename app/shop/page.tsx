import { getProducts, getCategories } from "@/lib/ecommerce";
import { ProductCard } from "@/components/product-card";
import { Sparkles, Filter } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryId } = await searchParams;
  const products = await getProducts(categoryId);
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-10 py-6">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-brand">
          <Sparkles size={18} />
          <span className="text-xs font-black uppercase tracking-widest">New Arrivals</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-black uppercase italic">
          THE <span className="text-brand">COLLECTION</span>
        </h1>
        <p className="max-w-xl text-muted text-sm sm:text-base">
          Browse our curated high-fashion catalog. Try any item instantly in our 
          AI studio before making your move.
        </p>
      </header>

      {/* Categories Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
        <a 
          href="/shop"
          className={`flex-shrink-0 px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
            !categoryId ? "bg-black text-white border-black" : "border-black/10 text-muted hover:border-black/30"
          }`}
        >
          All
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/shop?category=${cat.id}`}
            className={`flex-shrink-0 px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
              categoryId === cat.id ? "bg-black text-white border-black" : "border-black/10 text-muted hover:border-black/30"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center gap-4 border border-dashed border-black/10 rounded-2xl">
          <p className="text-muted font-bold text-xs uppercase tracking-widest">No items found in this category.</p>
          <a href="/shop" className="text-brand font-black uppercase text-[10px] tracking-widest">Clear Filters</a>
        </div>
      )}
    </div>
  );
}
