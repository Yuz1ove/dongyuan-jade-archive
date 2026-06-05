"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";
import { knowledgeCards, purchaseSteps } from "@/data/jade";
import type { Product } from "@/lib/products";

function StatusBadge({ status }: { status: Product["status"] }) {
  const tone =
    status === "可洽購"
      ? "border-[#c9a35b]/45 text-[#c9a35b]"
      : status === "已售出"
        ? "border-white/20 text-white/52"
        : "border-[#ead6a5]/35 text-[#ead6a5]";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${tone}`}>{status}</span>;
}

export default function HomeClient({ products, error }: { products: Product[]; error: string | null }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [preview, setPreview] = useState<string | null>(null);

  const categories = useMemo(() => getProductCategories(products), [products]);
  const availableProducts = useMemo(() => products.filter((product) => product.available), [products]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return availableProducts.filter((item) => {
      const categoryMatch = category === "全部" || item.category === category;
      const queryMatch = [item.title, item.category, item.water, item.color, item.description]
        .join(" ")
        .toLowerCase()
        .includes(normalized);

      return categoryMatch && queryMatch;
    });
  }, [availableProducts, category, query]);

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
        className="relative grid min-h-[100svh] items-start overflow-hidden px-5 pb-10 pt-28 text-white md:min-h-[92svh] md:items-end md:px-12 md:pb-48 md:pt-32 lg:px-20"
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
          <h1 className="max-w-4xl font-display text-4xl font-medium leading-[1.05] sm:text-5xl md:text-7xl md:leading-[.98] lg:text-8xl">
            東源翡藏，私人翡翠收藏釋出。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 md:mt-7 md:text-xl">
            展示並販售精選私人蒐藏，從手鐲、蛋面、雕件到吊墜，以清楚規格、證書資訊與收藏故事協助藏家安心賞藏與洽購。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
            <Link href="#collection" className="rounded-full bg-[#c9a35b] px-7 py-3 text-center text-sm font-bold text-[#06110d]">
              查看可售藏品
            </Link>
            <Link href="#consult" className="rounded-full border border-white/35 px-7 py-3 text-center text-sm font-bold text-white">
              上傳照片諮詢
            </Link>
          </div>
        </div>
        <div className="relative z-10 mx-auto mt-10 grid w-full max-w-7xl border border-[#ead6a5]/25 bg-[#06110d]/50 backdrop-blur-xl sm:grid-cols-3 md:absolute md:bottom-6 md:right-12 md:mt-0 md:w-[560px] md:max-w-none">
          {[
            ["公開釋出", `${availableProducts.filter((item) => item.status === "可洽購").length}`],
            ["收藏分類", `${Math.max(categories.length - 1, 0)}`],
            ["資料來源", "Google Sheets"],
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
          "公開商品資料由 Google Sheets 發布的 CSV 管理，更新後約 10 秒內重新載入。",
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
            這裡不是大量商品陳列，而是私人收藏釋出清單。公開列表只顯示 Google Sheets 中 available 不為 false 的藏品。
          </p>
        </div>
        <DataNotice error={error} dark={false} />
        {!error ? <CollectionGrid items={filteredItems.slice(0, 4)} dark={false} /> : null}
      </section>

      <section id="catalog" className="bg-[#0c2b22] px-5 py-20 text-white md:px-12 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#c9a35b]">
              Collection Catalog
            </p>
            <h2 className="font-display text-4xl font-medium md:text-6xl">分類目錄</h2>
            <p className="mt-5 text-base leading-8 text-white/68">
              可依名稱、分類、種水、顏色與描述搜尋；分類按鈕會依 CSV 內的 category 自動產生。
            </p>
          </div>
          <div className="grid gap-4 rounded-lg border border-[#ead6a5]/20 bg-white/[.06] p-5">
            <label className="grid gap-2 text-xs text-white/62">
              搜尋藏品
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 rounded-full border border-[#ead6a5]/25 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/40"
                placeholder="手鐲、陽綠、玻璃種..."
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                    category === item
                      ? "border-[#c9a35b] bg-[#c9a35b] text-[#06110d]"
                      : "border-[#ead6a5]/25 text-white/75 hover:text-[#ead6a5]"
                  }`}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <DataNotice error={error} dark />
            {!error ? <CollectionGrid items={filteredItems} dark /> : null}
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
              Data Workflow
            </span>
            <h3 className="mt-4 font-display text-4xl font-medium">Google Sheets 商品管理</h3>
            <p className="mt-5 leading-8 text-[#66736d]">
              商品名稱、價格、狀態、圖片網址與上下架可在 Google Sheets 中更新；圖片建議放在 Cloudinary、Supabase Storage 或 Vercel Blob。
            </p>
            <div className="mt-7 rounded-lg border border-[#0c2b22]/12 bg-[#f5f1e9] p-5 text-sm leading-7 text-[#66736d]">
              `/admin` 仍可作為上傳預覽與資料草稿介面；正式公開資料以 CSV 環境變數為準。
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function getProductCategories(products: Product[]) {
  return ["全部", ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))];
}

function DataNotice({ error, dark }: { error: string | null; dark: boolean }) {
  if (!error) return null;

  return (
    <div className={`mb-6 rounded-lg border p-8 text-center ${dark ? "border-[#ead6a5]/20 text-white/72" : "border-[#0c2b22]/15 text-[#66736d]"}`}>
      {error}
    </div>
  );
}

function CollectionGrid({ items, dark }: { items: Product[]; dark: boolean }) {
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
            {item.image ? (
              <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
            ) : (
              <div className="grid h-full place-items-center text-sm text-white/50">No image</div>
            )}
          </div>
          <div className="grid gap-4 p-5">
            <div className={`flex justify-between text-xs ${dark ? "text-white/62" : "text-[#66736d]"}`}>
              <span>{item.category}</span>
              <span>{item.water}</span>
            </div>
            <h3 className={`font-display text-3xl font-medium leading-tight ${dark ? "text-white" : "text-[#0c2b22]"}`}>
              {item.title}
            </h3>
            <p className={`line-clamp-3 text-sm leading-7 ${dark ? "text-white/62" : "text-[#66736d]"}`}>
              {item.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {[item.water, item.color].filter(Boolean).slice(0, 2).map((tag) => (
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
              <Link href={`/collections/${item.id}`} className={`text-sm font-bold ${dark ? "text-white" : "text-[#0c2b22]"}`}>
                藏品檔案
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
