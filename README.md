# 東源翡藏

高端翡翠私人收藏展示與販售網站。網站使用 Next.js App Router 與 Tailwind CSS，適合部署到 Vercel。

## 核心頁面

- `/`: 私人藏品展示與販售首頁
- `/collections/[id]`: 商品詳情頁
- `/collection/[id]`: 舊路徑，會自動轉址到 `/collections/[id]`
- `/admin`: 簡易藏品管理介面

## 可修改內容

- 商品 CSV 讀取邏輯：`src/lib/products.ts`
- Google Sheets 範例欄位：`products-example.csv`
- 首頁與販售版面：`src/app/page.tsx`
- 首頁互動搜尋與分類：`src/app/HomeClient.tsx`
- 藏品詳情頁：`src/app/collections/[id]/`
- 後台管理頁：`src/app/admin/page.tsx`
- 圖片資產：`public/images/`

## 商品資料：Google Sheets CSV

公開網站的商品資料由環境變數 `NEXT_PUBLIC_PRODUCTS_CSV_URL` 指向的 CSV 載入，不再從程式碼寫死藏品資料。Next.js 會用 `fetch` 讀取 CSV，並以 `next: { revalidate: 10 }` 讓 Vercel 約每 10 秒可重新取得最新內容。

CSV 欄位：

```text
id,title,category,water,color,price,size,weight,certificate,status,image,images,description,story,available
```

欄位說明：

- `id`: 商品網址代碼，例如 `imperial-bangle`，會用在 `/collections/imperial-bangle`
- `title`: 藏品名稱
- `category`: 分類，例如手鐲、蛋面、雕件、吊墜
- `water`: 種水，例如玻璃種、高冰種、冰種
- `color`: 顏色描述
- `price`: 建議填純數字，例如 `16800000`，網站會顯示成 `NT$ 16,800,000`
- `size`: 尺寸
- `weight`: 重量
- `certificate`: 證書資訊
- `status`: 可填 `可洽購`、`預約中`、`已售出`
- `image`: 主圖網址
- `images`: 多張圖片網址，用英文逗號 `,` 分隔；在 Google Sheets 內可用同一格填入
- `description`: 商品描述，會出現在列表搜尋與詳情頁
- `story`: 收藏故事
- `available`: `false`、`0`、`no`、`否`、`下架`、`停售` 會從公開列表隱藏；空白或 `true` 會顯示

專案內的 `products-example.csv` 已提供 4 筆完整範例，可直接複製到 Google Sheets。

## 建立 Google Sheets

1. 開啟 Google Sheets，建立一份新的試算表。
2. 第一列貼上欄位名稱：

```text
id,title,category,water,color,price,size,weight,certificate,status,image,images,description,story,available
```

3. 從 `products-example.csv` 複製範例資料貼到第 2 列開始。
4. 確認 `id` 不重複，`status` 使用 `可洽購`、`預約中`、`已售出`。
5. 圖片欄位請使用公開可讀的 HTTPS 圖片網址。

## 發布成 CSV

1. 在 Google Sheets 點選 `檔案`。
2. 選擇 `共用` → `發布到網路`。
3. 來源選擇你放商品資料的工作表。
4. 格式選擇 `逗號分隔值 (.csv)`。
5. 點選發布，複製產生的 CSV 網址。

CSV 網址通常會長得像：

```text
https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
```

## 設定 Vercel 環境變數

1. 打開 Vercel 專案 `dongyuan-jade-archive`。
2. 進入 `Settings` → `Environment Variables`。
3. 新增：

```text
NEXT_PUBLIC_PRODUCTS_CSV_URL
```

4. Value 貼上 Google Sheets 發布出的 CSV 網址。
5. Environment 勾選 Production、Preview、Development。
6. 儲存後重新部署一次 Production。

本地開發時可建立 `.env.local`：

```text
NEXT_PUBLIC_PRODUCTS_CSV_URL="你的 Google Sheets CSV 網址"
```

## 更新商品資料

日後更新商品不用改程式碼：

1. 回到 Google Sheets 修改價格、狀態、圖片、描述或 `available`。
2. 已發布的 CSV 會沿用同一個網址。
3. 網站約每 10 秒會重新取得資料。
4. 若想立刻確認，可重新整理網站頁面。

圖片建議放在雲端圖片服務，不要使用本機圖片路徑。建議選項：

- Cloudinary：適合圖片壓縮、裁切與 CDN
- Supabase Storage：適合和資料庫一起管理
- Vercel Blob：適合直接和 Vercel 專案整合

## 管理台

`/admin` 可以：

- 新增藏品
- 上傳圖片並預覽
- 修改售價
- 修改狀態：可洽購、預約中、已售出、私人留藏
- 匯出 JSON 備份

目前第一版使用瀏覽器 `localStorage` 保存管理台修改，適合快速維護與展示草稿；公開網站商品資料以 Google Sheets CSV 為準。正式多人後台建議接：

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
