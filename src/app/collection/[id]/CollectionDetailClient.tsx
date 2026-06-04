"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CollectionItem } from "@/data/jade";
import { getManagedCollections } from "@/lib/collection-store";

export default function CollectionDetailClient({ initialItem }: { initialItem: CollectionItem }) {
  const [item, setItem] = useState(initialItem);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const managed = getManagedCollections();
      setItem(managed.find((entry) => entry.id === initialItem.id) ?? initialItem);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initialItem]);

  const specs = [
    ["種水", item.grade],
    ["顏色", item.color],
    ["尺寸", item.size],
    ["重量", item.weight],
  ];

  return (
    <main className="min-h-screen bg-[#f5f1e9] px-5 py-8 md:px-12 lg:px-20">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-[#0c2b22]">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[#c9a35b]/70 font-display text-sm text-[#c9a35b]">
            東
          </span>
          <span>
            <strong className="block font-display text-2xl font-medium leading-none">東源翡藏</strong>
            <small className="mt-1 block text-[10px] uppercase tracking-[.18em] text-[#66736d]">
              Private Sale Record
            </small>
          </span>
        </Link>
        <Link href="/#collection" className="rounded-full border border-[#0c2b22]/15 px-5 py-2 text-sm font-bold text-[#0c2b22]">
          返回館藏
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 py-12 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:py-20">
        <div className="relative overflow-hidden rounded-lg border border-[#0c2b22]/15 bg-[#0c2b22] shadow-[0_24px_70px_rgba(3,18,13,.24)]">
          <img src={item.image} alt={item.title} className="aspect-[1/1.08] w-full object-cover" />
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#c9a35b]">
            {item.category} / {item.grade}
          </p>
          <h1 className="font-display text-5xl font-medium leading-tight text-[#0c2b22] md:text-7xl">
            {item.title}
          </h1>
          <p className="mt-6 text-base leading-8 text-[#66736d] md:text-lg">{item.story}</p>
          <div className="mt-8 grid gap-4 border-t border-[#0c2b22]/12 pt-6 sm:grid-cols-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-[.15em] text-[#66736d]">
                售價
              </span>
              <strong className="mt-2 block font-display text-4xl font-medium text-[#c9a35b] md:text-5xl">
                {item.price}
              </strong>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[.15em] text-[#66736d]">
                狀態
              </span>
              <strong className="mt-3 inline-flex rounded-full border border-[#c9a35b]/45 px-4 py-2 text-sm text-[#0c2b22]">
                {item.status}
              </strong>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#consult" className="rounded-full bg-[#0c2b22] px-7 py-3 text-center text-sm font-bold text-white">
              預約洽購
            </Link>
            <Link href="/admin" className="rounded-full border border-[#0c2b22]/15 px-7 py-3 text-center text-sm font-bold text-[#0c2b22]">
              修改價格
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 pb-16 lg:grid-cols-2">
        <article className="rounded-lg border border-[#0c2b22]/15 bg-white p-7">
          <h2 className="font-display text-3xl font-medium text-[#0c2b22]">藏品規格</h2>
          <dl className="mt-6 grid gap-5">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-extrabold uppercase tracking-[.1em] text-[#66736d]">
                  {label}
                </dt>
                <dd className="mt-1 text-[#0c2b22]">{value}</dd>
              </div>
            ))}
          </dl>
        </article>
        <article className="rounded-lg border border-[#0c2b22]/15 bg-white p-7">
          <h2 className="font-display text-3xl font-medium text-[#0c2b22]">證書資訊</h2>
          <p className="mt-6 leading-8 text-[#66736d]">{item.certificate}</p>
        </article>
        <article className="rounded-lg border border-[#0c2b22]/15 bg-white p-7 lg:col-span-2">
          <h2 className="font-display text-3xl font-medium text-[#0c2b22]">收藏故事</h2>
          <p className="mt-6 leading-8 text-[#66736d]">{item.story}</p>
        </article>
      </section>
    </main>
  );
}
