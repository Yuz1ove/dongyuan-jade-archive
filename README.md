# 東源翡藏

高端翡翠私人收藏展示與販售網站。網站使用 Next.js App Router 與 Tailwind CSS，適合部署到 Vercel。

## 核心頁面

- `/`: 私人藏品展示與販售首頁
- `/collection/imperial-bangle`
- `/collection/green-cabochon`
- `/collection/guanyin-pendant`
- `/collection/lavender-pendant`
- `/admin`: 簡易藏品管理介面

## 可修改內容

- 預設藏品資料：`src/data/jade.ts`
- 首頁與販售版面：`src/app/page.tsx`
- 藏品詳情頁：`src/app/collection/[id]/`
- 後台管理頁：`src/app/admin/page.tsx`
- 圖片資產：`public/images/`

## 管理台

`/admin` 可以：

- 新增藏品
- 上傳圖片並預覽
- 修改售價
- 修改狀態：可洽購、預約中、已售出、私人留藏
- 匯出 JSON 備份

目前第一版使用瀏覽器 `localStorage` 保存管理台修改，適合快速維護與展示。正式多人後台建議接：

- Vercel Blob：保存上傳圖片
- Vercel Postgres / Supabase：保存藏品資料、價格與狀態
- 簡易登入保護 `/admin`

## 本地開發

```bash
npm run dev
```

開發網址：

```text
http://localhost:3000
```

Next.js 16 需要 Node.js `>=20.9.0`。

## 部署

建議流程：

1. 將專案 push 到 GitHub。
2. 在 Vercel 匯入 GitHub repo。
3. Vercel 使用預設 Next.js 設定部署。
4. 日後修改後 `git push`，Vercel 會自動重新部署。

驗證指令：

```bash
npm run lint
npm run build
```
