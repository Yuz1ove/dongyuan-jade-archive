"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { categories, collections, knowledgeCards, purchaseSteps } from "@/data/jade";
import type { CollectionItem } from "@/data/jade";
import { getManagedCollections } from "@/lib/collection-store";

function StatusBadge({ status }: { status: CollectionItem["status"] }) {
  const tone =
    status === "可洽購"
      ? "border-[#c9a35b]/45 text-[#c9a35b]"
      : status === "已售出"
        ? "border-white/20 text-white/52"
        : "border-[#0c2b22]/20 text-[#0c2b22]";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${tone}`}>{status}</span>;
}

export default function Home() {
  const [items, setItems] = useState<CollectionItem[]>(collections);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setItems(getManagedCollections()), 0);

    function handleStorage() {
      setItems(getManagedCollections());
    }

    window.addEventListener("storage", handleStorage);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const categoryMatch = category === "全部" || item.category === category;
      const queryMatch = [item.title, item.category, item.grade, item.color, item.price, item.status]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
      return categoryMatch && queryMatch;
    });
  }, [category, items, query]);

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  return (
    <main className="min-h-screen bg-[#fbfaf6]">
      <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/10 bg-[#06110d]/60 px-5 py-4 text-white backdrop-blur-xl md:px-12">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link href="#home" className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-[#c9a35b]/70 font-display text-sm text-[#ead6a5]">
              東
            </span>
            <span className="min-w-0">
              <strong className="block font-display text-xl font-medium leading-none md:text-2xl">
                東源翡藏
              </strong>
              <small className="mt-1 block text-[10px] uppercase tracking-[.18em] text-white/62">
                Private Jade Collection
              </small>
            </span>
          </Link>
          <div className="hidden items-center gap-7 text-sm text-white/78 lg:flex">
            {[
              ["精選藏品", "#collection"],
              ["分類目錄", "#catalog"],
              ["翡翠知識", "#knowledge"],
              ["購藏流程", "#purchase"],
              ["上傳諮詢", "#consult"],
              ["管理", "/admin"],
            ].map(([label, href]) => (
              <Link key={label} href={href} className="transition hover:text-[#ead6a5]">
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <section
        id="home"
        className="relative grid min-h-[92svh] items-end overflow-hidden px-5 pb-48 pt-32 text-white md:px-12 lg:px-20"
      >
        <Image
          src="/images/hero-jadeite.png"
          alt="深墨綠翡翠特寫"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,18,13,.94),rgba(3,18,13,.66)_44%,rgba(3,18,13,.18)),linear-gradient(0deg,rgba(3,18,13,.8),rgba(3,18,13,.08)_48%)]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#c9a35b]">
            Private Collection For Sale
          </p>
          <h1 className="max-w-4xl font-display text-5xl font-medium leading-[.98] md:text-7xl lg:text-8xl">
            東源翡藏，私人翡翠收藏釋出。
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/78 md:text-xl">
            展示並販售精選私人蒐藏，從手鐲、蛋面、雕件到吊墜，以清楚規格、證書資訊與收藏故事協助藏家安心賞藏與洽購。
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="#collection" className="rounded-full bg-[#c9a35b] px-7 py-3 text-center text-sm font-bold text-[#06110d]">
              查看可售藏品
            </Link>
            <Link href="#consult" className="rounded-full border border-white/35 px-7 py-3 text-center text-sm font-bold text-white">
              上傳照片諮詢
            </Link>
          </div>
        </div>
        <div className="absolute bottom-6 right-5 z-10 grid w-[calc(100%-2.5rem)] border border-[#ead6a5]/25 bg-[#06110d]/50 backdrop-blur-xl sm:grid-cols-3 md:right-12 md:w-[560px]">
          {[
            ["公開釋出", `${items.filter((item) => item.status === "可洽購").length}`],
            ["收藏分類", "6+"],
            ["交易方式", "預約洽購"],
          ].map(([label, value]) => (
            <div key={label} className="border-[#ead6a5]/20 p-5 sm:border-l first:sm:border-l-0">
              <span className="text-xs text-white/62">{label}</span>
              <strong className="mt-2 block font-display text-3xl font-medium text-[#ead6a5]">
                {value}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <section className="grid border-b border-[#0c2b22]/15 bg-[#f5f1e9] lg:grid-cols-3">
        {[
          "每件藏品保留照片、種水、顏色、尺寸、重量、證書資訊與收藏故事。",
          "網站以私人收藏釋出為核心，價格與狀態可在簡易管理介面快速更新。",
          "保留翡翠知識庫與分類目錄，讓買家能理解藏品差異，而不是只看價格。",
        ].map((text, index) => (
          <div key={text} className="grid grid-cols-[3.5rem_1fr] gap-5 border-[#0c2b22]/15 p-7 lg:border-l first:lg:border-l-0">
            <span className="font-display text-3xl text-[#c9a35b]">{String(index + 1).padStart(2, "0")}</span>
            <p className="text-sm leading-7 text-[#66736d] md:text-base">{text}</p>
          </div>
        ))}
      </section>

      <section id="collection" className="px-5 py-20 md:px-12 lg:px-20 lg:py-32">
        <div className="mx-auto mb-12 grid max-w-7xl gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#c9a35b]">
              Selected Private Pieces
            </p>
            <h2 className="font-display text-4xl font-medium leading-tight text-[#0c2b22] md:text-6xl">
              精選可售藏品
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#66736d]">
            這裡不是大量商品陳列，而是私人收藏釋出清單。可洽購藏品會清楚標示價格，預約中與已售出則保留作為收藏紀錄。
          </p>
        </div>
        <CollectionGrid items={filteredItems.slice(0, 4)} dark={false} />
      </section>

      <section id="catalog" className="bg-[#0c2b22] px-5 py-20 text-white md:px-12 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#c9a35b]">
              Collection Catalog
            </p>
            <h2 className="font-display text-4xl font-medium md:text-6xl">分類目錄</h2>
            <p className="mt-5 text-base leading-8 text-white/68">
              可依品類、種水、顏色、價格或狀態搜尋。這個區塊之後可直接接到後台資料庫。
            </p>
          </div>
          <div className="grid gap-4 rounded-lg border border-[#ead6a5]/20 bg-white/[.06] p-5 md:grid-cols-[1fr_220px]">
            <label className="grid gap-2 text-xs text-white/62">
              搜尋藏品
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 rounded-full border border-[#ead6a5]/25 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/40"
                placeholder="手鐲、陽綠、可洽購..."
              />
            </label>
            <label className="grid gap-2 text-xs text-white/62">
              分類
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-12 rounded-full border border-[#ead6a5]/25 bg-white/10 px-4 text-base text-white outline-none [&_option]:text-[#0c2b22]"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-8">
            <CollectionGrid items={filteredItems} dark />
          </div>
        </div>
      </section>

      <section id="knowledge" className="bg-[#f5f1e9] px-5 py-20 md:px-12 lg:px-20 lg:py-32">
        <div className="mx-auto mb-12 grid max-w-7xl gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#c9a35b]">
              Jadeite Knowledge
            </p>
            <h2 className="font-display text-4xl font-medium leading-tight text-[#0c2b22] md:text-6xl">
              翡翠知識庫
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#66736d]">
            保留收藏教育內容，讓買家理解種、水、色、工的差異，也讓每件藏品的價值語言更清楚。
          </p>
        </div>
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden border border-[#0c2b22]/15 bg-[#0c2b22]/15 md:grid-cols-2 xl:grid-cols-4">
          {knowledgeCards.map(([mark, title, body]) => (
            <article key={title} className="min-h-72 bg-[#fbfaf6] p-7">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-[#c9a35b]/45 font-display text-2xl text-[#c9a35b]">
                {mark}
              </span>
              <h3 className="mt-12 font-display text-3xl font-medium leading-tight text-[#0c2b22]">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#66736d]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="purchase" className="px-5 py-20 md:px-12 lg:px-20 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#c9a35b]">
              Purchase Flow
            </p>
            <h2 className="font-display text-4xl font-medium leading-tight text-[#0c2b22] md:text-6xl">
              預約洽購流程
            </h2>
            <p className="mt-6 text-base leading-8 text-[#66736d]">
              私人藏品採預約洽購，不放購物車，不做衝動下單。每筆交易都以藏品狀態、證書、細節照片與交付條件確認後進行。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {purchaseSteps.map(([num, title, body]) => (
              <article key={title} className="rounded-lg border border-[#0c2b22]/15 bg-white p-6">
                <span className="font-display text-3xl text-[#c9a35b]">{num}</span>
                <h3 className="mt-5 font-display text-2xl font-medium text-[#0c2b22]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#66736d]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="consult" className="grid gap-10 bg-[#06110d] px-5 py-20 text-white md:px-12 lg:grid-cols-[.78fr_1.22fr] lg:px-20 lg:py-32">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#c9a35b]">
            Image Upload
          </p>
          <h2 className="font-display text-4xl font-medium leading-tight md:text-6xl">上傳照片諮詢</h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/68">
            買家可先上傳參考照片或欲詢問的翡翠細節。正式版會串接後台儲存與通知；目前先提供即時預覽介面。
          </p>
          <Link href="/admin" className="mt-8 inline-flex rounded-full border border-[#ead6a5]/35 px-6 py-3 text-sm font-bold text-[#ead6a5]">
            進入藏品管理
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <label className="relative grid min-h-[360px] cursor-pointer content-center justify-items-center gap-3 overflow-hidden rounded-lg border border-[#ead6a5]/22 bg-white/[.08] p-8 text-center lg:min-h-[440px]">
            <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
            {preview ? <img src={preview} alt="上傳翡翠預覽" className="absolute inset-0 h-full w-full object-cover" /> : null}
            {preview ? <div className="absolute inset-0 bg-gradient-to-t from-[#06110d]/85 to-transparent" /> : null}
            <span className="relative z-10 grid h-16 w-16 place-items-center rounded-full border border-[#ead6a5]/45 text-4xl leading-none text-[#ead6a5]">
              +
            </span>
            <strong className="relative z-10 font-display text-3xl font-medium">上傳翡翠照片</strong>
            <small className="relative z-10 text-white/58">JPG / PNG / HEIC</small>
          </label>
          <div className="rounded-lg border border-[#ead6a5]/22 bg-[#fbfaf6] p-7 text-[#0c2b22] md:p-10">
            <span className="text-xs font-bold uppercase tracking-[.15em] text-[#66736d]">
              Inquiry Draft
            </span>
            <h3 className="mt-4 font-display text-4xl font-medium">私人洽購與照片諮詢</h3>
            <p className="mt-5 leading-8 text-[#66736d]">
              上傳後可作為洽詢附件。下一階段若接 Vercel Blob，圖片會被永久保存，管理台也能直接替換藏品圖、調整價格與上下架狀態。
            </p>
            <div className="mt-7 rounded-lg border border-[#0c2b22]/12 bg-[#f5f1e9] p-5 text-sm leading-7 text-[#66736d]">
              目前後台資料儲存在此瀏覽器，適合快速管理第一版。若要多人登入、永久保存與正式交易紀錄，會接資料庫與物件儲存。
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CollectionGrid({ items, dark }: { items: CollectionItem[]; dark: boolean }) {
  if (items.length === 0) {
    return (
      <div className={`rounded-lg border p-8 text-center ${dark ? "border-white/15 text-white/65" : "border-[#0c2b22]/15 text-[#66736d]"}`}>
        目前沒有符合條件的藏品。
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.id}
          className={`overflow-hidden rounded-lg border shadow-[0_16px_44px_rgba(20,31,27,.08)] ${
            dark ? "border-[#ead6a5]/18 bg-white/[.07] text-white" : "border-[#0c2b22]/15 bg-white"
          }`}
        >
          <div className="relative aspect-[1/1.08] overflow-hidden bg-[#0c2b22]">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
          </div>
          <div className="grid gap-4 p-5">
            <div className={`flex justify-between text-xs ${dark ? "text-white/62" : "text-[#66736d]"}`}>
              <span>{item.category}</span>
              <span>{item.grade}</span>
            </div>
            <h3 className={`font-display text-3xl font-medium leading-tight ${dark ? "text-white" : "text-[#0c2b22]"}`}>
              {item.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className={`rounded-full border px-3 py-1 text-xs ${dark ? "border-[#ead6a5]/35 text-[#ead6a5]" : "border-[#c9a35b]/35 text-[#123b2e]"}`}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={`flex items-end justify-between gap-4 border-t pt-4 ${dark ? "border-white/12" : "border-[#0c2b22]/12"}`}>
              <div>
                <StatusBadge status={item.status} />
                <strong className={`mt-3 block text-lg ${dark ? "text-[#ead6a5]" : "text-[#0c2b22]"}`}>
                  {item.price}
                </strong>
              </div>
              <Link href={`/collection/${item.id}`} className={`text-sm font-bold ${dark ? "text-white" : "text-[#0c2b22]"}`}>
                藏品檔案
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
