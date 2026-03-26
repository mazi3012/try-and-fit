import { getProductById, getProducts } from "@/lib/ecommerce";
import { ProductCard } from "@/components/product-card";
import { ProductActions } from "./actions"; // New client component
import { ChevronRight, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product;
  try {
    product = await getProductById(id);
  } catch (e) {
    return notFound();
  }

  const relatedProducts = await getProducts(product.category_id, 4);

  return (
    <div className="flex flex-col gap-16 py-6 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted">
        <Link href="/shop" className="hover:text-brand transition-colors">Shop</Link>
        <ChevronRight size={10} />
        <span className="text-cream">{product.categories.name}</span>
      </nav>

      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-20">
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[#141414] border border-white/5">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
             {/* Additional images loop if they existed */}
             <div className="aspect-square bg-white/5 border border-brand/20 rounded-lg overflow-hidden p-0.5">
                <img src={product.image_url} className="w-full h-full object-cover grayscale opacity-50" />
             </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-8">
           <div className="flex flex-col gap-2">
              <p className="text-xs font-black uppercase tracking-widest text-brand">{product.brand}</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-cream leading-[0.9]">{product.name}</h1>
           </div>

           <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black text-cream">₹{product.price}</span>
              {product.compare_price && (
                <span className="text-xl line-through text-muted/50">₹{product.compare_price}</span>
              )}
           </div>

           <p className="text-muted leading-relaxed text-sm lg:text-base">
              {product.description}
           </p>

           {/* Sizes */}
           <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted">
                 <span>Pick Your Size</span>
                 <a href="#" className="underline text-brand">Size Guide</a>
              </div>
              <div className="flex flex-wrap gap-3">
                 {product.sizes.map(size => (
                    <button key={size} className="h-12 w-16 flex items-center justify-center border border-white/10 rounded-lg text-xs font-bold hover:border-brand hover:text-brand transition-all">
                       {size}
                    </button>
                 ))}
              </div>
           </div>

           {/* Actions */}
           <ProductActions product={product} />

           {/* Perks */}
           <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5">
              {[
                { icon: <Truck size={14} />, label: "Free Shipping" },
                { icon: <ShieldCheck size={14} />, label: "Authentic" },
                { icon: <RefreshCcw size={14} />, label: "30 Days Return" }
              ].map((perk, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                   <div className="text-accent">{perk.icon}</div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-muted/60">{perk.label}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Related Section */}
      <section className="flex flex-col gap-8 pt-10">
         <h2 className="text-2xl font-black text-cream">PEOPLE ALSO <span className="text-brand">TRIED</span></h2>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
         </div>
      </section>
    </div>
  );
}
