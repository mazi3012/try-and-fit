import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-6 py-8 sm:py-12">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-brand to-accent p-6 text-white sm:p-10">
        <p className="mb-3 inline-block rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          AI Virtual Try-On
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">TryAndFit</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-lg">
          See outfits on your own photo before you buy. Upload images or paste product links from
          Myntra, Flipkart, Amazon, Meesho, AJIO, Instagram, and more.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/try-on"
            className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-brand"
          >
            Start Try-On
          </Link>
          <Link
            href="/wardrobe"
            className="rounded-xl border border-white/40 px-5 py-3 text-center text-sm font-semibold"
          >
            View Wardrobe
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Photo Upload",
            desc: "Upload your photo and outfit photo directly.",
          },
          {
            title: "Product URL",
            desc: "Paste e-commerce links and auto-extract outfit image.",
          },
          {
            title: "Fast Results",
            desc: "Track status and get try-on output in seconds.",
          },
          {
            title: "Save + Share",
            desc: "Save to wardrobe, download, and share results.",
          },
        ].map((item) => (
          <article key={item.title} className="card p-4 sm:p-5">
            <h2 className="text-base font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted">{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
