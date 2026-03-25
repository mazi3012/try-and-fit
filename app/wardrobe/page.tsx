"use client";

import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { listWardrobe, removeWardrobe } from "@/lib/mock-api";
import type { WardrobeItem } from "@/lib/types";

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);

  useEffect(() => {
    setItems(listWardrobe());
  }, []);

  const onDelete = (id: string) => {
    removeWardrobe(id);
    setItems(listWardrobe());
  };

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Your Wardrobe"
        subtitle="Saved try-on results are stored here for quick comparison."
      />

      {items.length === 0 ? (
        <div className="card p-6 text-sm text-muted">No saved looks yet. Save from the result screen.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="card p-3">
              <img src={item.resultImage} alt={item.outfitName} className="h-72 w-full rounded-xl object-cover" />
              <p className="mt-3 text-sm font-semibold">{item.outfitName}</p>
              <p className="mt-1 text-xs text-muted">{new Date(item.createdAt).toLocaleString()}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="btn-outline rounded-lg px-3 py-1 text-xs"
                >
                  Remove
                </button>
                {item.buyUrl ? (
                  <a href={item.buyUrl} target="_blank" rel="noreferrer" className="btn-outline rounded-lg px-3 py-1 text-xs">
                    Product link
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
