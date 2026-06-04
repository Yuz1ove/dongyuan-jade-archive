"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { categories, collections } from "@/data/jade";
import type { CollectionItem, CollectionStatus } from "@/data/jade";
import {
  getManagedCollections,
  makeCollectionId,
  resetManagedCollections,
  saveManagedCollections,
} from "@/lib/collection-store";

const statuses: CollectionStatus[] = ["可洽購", "預約中", "已售出", "私人留藏"];

const blankItem: CollectionItem = {
  id: "",
  title: "",
  category: "手鐲",
  image: "/images/jade-bangle.png",
  grade: "",
  color: "",
  size: "",
  weight: "",
  certificate: "",
  price: "",
  status: "可洽購",
  story: "",
  tags: [],
};

export default function AdminPage() {
  const [items, setItems] = useState<CollectionItem[]>(collections);
  const [draft, setDraft] = useState<CollectionItem>(blankItem);
  const [tagText, setTagText] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setItems(getManagedCollections()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId) ?? null,
    [activeId, items],
  );

  function persist(nextItems: CollectionItem[]) {
    setItems(nextItems);
    saveManagedCollections(nextItems);
  }

  function startEdit(item: CollectionItem) {
    setActiveId(item.id);
    setDraft(item);
    setTagText(item.tags.join("、"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setActiveId(null);
    setDraft(blankItem);
    setTagText("");
  }

  function updateDraft(field: keyof CollectionItem, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateDraft("image", reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function saveDraft() {
    const title = draft.title.trim();
    if (!title) return;

    const normalizedDraft: CollectionItem = {
      ...draft,
      id: activeId ?? makeCollectionId(title),
      title,
      tags: tagText
        .split(/[、,，]/)
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const nextItems = activeId
      ? items.map((item) => (item.id === activeId ? normalizedDraft : item))
      : [normalizedDraft, ...items];

    persist(nextItems);
    resetForm();
  }

  function quickUpdatePrice(id: string, price: string) {
    persist(items.map((item) => (item.id === id ? { ...item, price } : item)));
  }

  function quickUpdateStatus(id: string, status: CollectionStatus) {
    persist(items.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  function restoreDefaults() {
    resetManagedCollections();
    setItems(collections);
    resetForm();
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "dongyuan-collections.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#f5f1e9] px-5 py-8 md:px-12 lg:px-20">
      <header className="mx-auto flex max-w-7xl flex-col gap-5 py-3 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-3 text-[#0c2b22]">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[#c9a35b]/70 font-display text-sm text-[#c9a35b]">
            東
          </span>
          <span>
            <strong className="block font-display text-2xl font-medium leading-none">東源翡藏</strong>
            <small className="mt-1 block text-[10px] uppercase tracking-[.18em] text-[#66736d]">
              Collection Manager
            </small>
          </span>
        </Link>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="rounded-full border border-[#0c2b22]/15 px-5 py-2 text-sm font-bold text-[#0c2b22]">
            回到網站
          </Link>
          <button onClick={exportJson} className="rounded-full border border-[#0c2b22]/15 px-5 py-2 text-sm font-bold text-[#0c2b22]" type="button">
            匯出資料
          </button>
          <button onClick={restoreDefaults} className="rounded-full bg-[#0c2b22] px-5 py-2 text-sm font-bold text-white" type="button">
            還原預設
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 py-10 lg:grid-cols-[420px_1fr]">
        <aside className="rounded-lg border border-[#0c2b22]/15 bg-white p-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#c9a35b]">
            {activeItem ? "Edit Collection" : "New Collection"}
          </p>
          <h1 className="font-display text-4xl font-medium text-[#0c2b22]">
            {activeItem ? "修改藏品" : "新增藏品"}
          </h1>

          <div className="mt-7 grid gap-4">
            <AdminField label="藏品名稱">
              <input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} className="admin-input" placeholder="例：高冰陽綠蛋面" />
            </AdminField>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="分類">
                <select value={draft.category} onChange={(event) => updateDraft("category", event.target.value)} className="admin-input">
                  {categories.filter((item) => item !== "全部").map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="狀態">
                <select value={draft.status} onChange={(event) => updateDraft("status", event.target.value as CollectionStatus)} className="admin-input">
                  {statuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </AdminField>
            </div>
            <AdminField label="售價">
              <input value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} className="admin-input" placeholder="NT$ 680,000" />
            </AdminField>
            <AdminField label="圖片">
              <label className="grid cursor-pointer gap-3 rounded-lg border border-dashed border-[#0c2b22]/20 bg-[#f5f1e9] p-4 text-center text-sm text-[#66736d]">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                {draft.image ? <img src={draft.image} alt="藏品預覽" className="mx-auto aspect-square w-40 rounded-md object-cover" /> : null}
                選擇圖片並預覽
              </label>
            </AdminField>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="種水">
                <input value={draft.grade} onChange={(event) => updateDraft("grade", event.target.value)} className="admin-input" />
              </AdminField>
              <AdminField label="重量">
                <input value={draft.weight} onChange={(event) => updateDraft("weight", event.target.value)} className="admin-input" />
              </AdminField>
            </div>
            <AdminField label="顏色">
              <input value={draft.color} onChange={(event) => updateDraft("color", event.target.value)} className="admin-input" />
            </AdminField>
            <AdminField label="尺寸">
              <input value={draft.size} onChange={(event) => updateDraft("size", event.target.value)} className="admin-input" />
            </AdminField>
            <AdminField label="證書資訊">
              <textarea value={draft.certificate} onChange={(event) => updateDraft("certificate", event.target.value)} className="admin-input min-h-24 resize-y" />
            </AdminField>
            <AdminField label="標籤">
              <input value={tagText} onChange={(event) => setTagText(event.target.value)} className="admin-input" placeholder="玻璃種、滿色、A 貨" />
            </AdminField>
            <AdminField label="收藏故事">
              <textarea value={draft.story} onChange={(event) => updateDraft("story", event.target.value)} className="admin-input min-h-28 resize-y" />
            </AdminField>
            <div className="grid gap-3 sm:grid-cols-2">
              <button onClick={saveDraft} className="rounded-full bg-[#c9a35b] px-5 py-3 text-sm font-bold text-[#06110d]" type="button">
                儲存藏品
              </button>
              <button onClick={resetForm} className="rounded-full border border-[#0c2b22]/15 px-5 py-3 text-sm font-bold text-[#0c2b22]" type="button">
                清空表單
              </button>
            </div>
          </div>
        </aside>

        <section className="rounded-lg border border-[#0c2b22]/15 bg-white p-6">
          <div className="flex flex-col gap-4 border-b border-[#0c2b22]/12 pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-[#c9a35b]">
                Price Editor
              </p>
              <h2 className="font-display text-4xl font-medium text-[#0c2b22]">快速修改價格</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#66736d]">
              這個介面會將資料保存在目前瀏覽器。正式多人後台可沿用同一資料結構接資料庫。
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {items.map((item) => (
              <article key={item.id} className="grid gap-4 rounded-lg border border-[#0c2b22]/12 bg-[#fbfaf6] p-4 md:grid-cols-[96px_1fr]">
                <img src={item.image} alt={item.title} className="aspect-square w-24 rounded-md object-cover" />
                <div className="grid gap-4 xl:grid-cols-[1fr_220px_160px_auto] xl:items-end">
                  <div>
                    <span className="text-xs text-[#66736d]">{item.category} / {item.grade}</span>
                    <h3 className="font-display text-2xl font-medium text-[#0c2b22]">{item.title}</h3>
                  </div>
                  <AdminField label="價格">
                    <input value={item.price} onChange={(event) => quickUpdatePrice(item.id, event.target.value)} className="admin-input" />
                  </AdminField>
                  <AdminField label="狀態">
                    <select value={item.status} onChange={(event) => quickUpdateStatus(item.id, event.target.value as CollectionStatus)} className="admin-input">
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </AdminField>
                  <button onClick={() => startEdit(item)} className="rounded-full border border-[#0c2b22]/15 px-5 py-3 text-sm font-bold text-[#0c2b22]" type="button">
                    編輯全部
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-xs font-bold uppercase tracking-[.08em] text-[#66736d]">
      {label}
      {children}
    </label>
  );
}
