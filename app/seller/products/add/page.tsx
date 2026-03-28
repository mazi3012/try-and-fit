"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Tag, IndianRupee, Image as ImageIcon, Sparkles, AlertCircle, CheckCircle2, Package, LayoutGrid, Info } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { uploadImage, getProfile } from "@/lib/supabase-api";
import { getCategories } from "@/lib/ecommerce";
import { Dropzone } from "@/components/ui/dropzone";
import { cn } from "@/lib/utils";
import type { Category, UserProfile } from "@/lib/types";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Check if user is an approved seller
    getProfile().then(p => {
      if (!p || p.role !== 'seller' || p.seller_status !== 'approved') {
        router.replace("/seller/apply");
      } else {
        setProfile(p);
      }
    });

    // Load categories
    getCategories().then(setCategories).catch(console.error);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !imageUrl) { setError("Product image is required."); return; }
    if (!categoryId) { setError("Please select a category."); return; }

    setLoading(true);
    setError("");
    
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile, 'user-images'); // Usually would go to a 'products' bucket
      }

      const { error: insertError } = await supabase
        .from('products')
        .insert({
          name,
          description,
          price: parseFloat(price),
          category_id: categoryId,
          brand,
          image_url: finalImageUrl,
          seller_id: profile?.id,
          in_stock: true
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => router.push("/seller/dashboard"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to add product.");
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Col: Info */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-[#111] text-white rounded-[32px] p-8 shadow-xl">
            <div className="h-12 w-12 rounded-2xl bg-brand/20 flex items-center justify-center text-brand mb-6">
              <Package size={24} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-4">
              Lisiting <br/><span className="text-brand">Center</span>
            </h1>
            <p className="text-xs text-white/50 font-medium leading-relaxed">
              Add products to your store. Make sure to provide clear images and detailed descriptions to increase sales.
            </p>
            
            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-brand" />
                <span className="text-[10px] font-black uppercase tracking-widest">Instant AI Previews</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-brand" />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Visibility</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-amber-700 leading-tight uppercase tracking-tight">
              All products undergo a quick automated safety check before appearing in the shop.
            </p>
          </div>
        </div>

        {/* Right Col: Form */}
        <div className="flex-1 bg-white border border-black/5 rounded-[32px] p-6 sm:p-10 shadow-sm">
          {success ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-20 w-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-[#111] uppercase tracking-tight">Product Listed!</h2>
              <p className="text-sm text-[#888] font-medium">Your product has been added to the catalog successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-[#111] uppercase tracking-[0.2em] pb-4 border-b border-black/5">Product Information</h3>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Product Name *</label>
                    <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Classic Oversized Hoodie" className="input bg-[#F7F7F7] border-0 focus:ring-2" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Brand Name *</label>
                    <input required value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Zara" className="input bg-[#F7F7F7] border-0 focus:ring-2" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Category *</label>
                    <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="input bg-[#F7F7F7] border-0 focus:ring-2">
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Price (INR) *</label>
                    <div className="relative">
                      <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
                      <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="999" className="input bg-[#F7F7F7] border-0 focus:ring-2 pl-9" />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#888]">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your product materials, fit, and style..." className="input bg-[#F7F7F7] border-0 focus:ring-2 min-h-[120px] pt-3" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-[#111] uppercase tracking-[0.2em] pb-4 border-b border-black/5">Visual Assets</h3>
                <div className="aspect-[16/9] sm:aspect-[21/9]">
                  <Dropzone
                    label="Primary product image"
                    previewUrl={imageUrl}
                    onFileSelect={(file) => {
                      if (file) {
                        setImageFile(file);
                        setImageUrl(URL.createObjectURL(file));
                      } else {
                        setImageFile(null);
                        setImageUrl("");
                      }
                    }}
                    className="h-full rounded-2xl border-2 border-dashed"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-500">
                  <AlertCircle size={18} />
                  <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-brand text-white rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest hover:bg-brand/90 transition-all shadow-xl shadow-brand/20 disabled:opacity-50"
              >
                {loading ? "Listing Product..." : <><Sparkles size={18} /> List on Marketplace</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
