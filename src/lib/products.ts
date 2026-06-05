export type ProductStatus = "可洽購" | "預約中" | "已售出";

export type Product = {
  id: string;
  title: string;
  category: string;
  water: string;
  color: string;
  price: string;
  size: string;
  weight: string;
  certificate: string;
  status: ProductStatus;
  image: string;
  images: string[];
  description: string;
  story: string;
  available: boolean;
};

export type ProductLoadResult = {
  products: Product[];
  error: string | null;
};

const CSV_UNAVAILABLE_MESSAGE = "目前藏品資料暫時無法載入";
const VALID_STATUSES: ProductStatus[] = ["可洽購", "預約中", "已售出"];
const REQUIRED_HEADERS = ["id", "title", "category", "water", "color", "price", "image", "available"];

export async function getProducts(): Promise<ProductLoadResult> {
  const csvUrl = process.env.NEXT_PUBLIC_PRODUCTS_CSV_URL;

  if (!csvUrl) {
    return { products: [], error: CSV_UNAVAILABLE_MESSAGE };
  }

  try {
    const response = await fetch(csvUrl, { next: { revalidate: 10 } });

    if (!response.ok) {
      return { products: [], error: CSV_UNAVAILABLE_MESSAGE };
    }

    const csv = await response.text();
    const rows = parseCsv(csv);

    if (!hasRequiredHeaders(rows.headers)) {
      return { products: [], error: CSV_UNAVAILABLE_MESSAGE };
    }

    const products = rows.map(normalizeProduct).filter((product): product is Product => Boolean(product));

    return { products, error: null };
  } catch {
    return { products: [], error: CSV_UNAVAILABLE_MESSAGE };
  }
}

export async function getPublicProducts(): Promise<ProductLoadResult> {
  const result = await getProducts();

  return {
    ...result,
    products: result.products.filter((product) => product.available),
  };
}

export async function getProductById(id: string) {
  const result = await getPublicProducts();
  return {
    ...result,
    product: result.products.find((product) => product.id === id) ?? null,
  };
}

export function getProductCategories(products: Product[]) {
  return ["全部", ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))];
}

export function getProductGallery(product: Product) {
  return [product.image, ...product.images].filter((image, index, images) => image && images.indexOf(image) === index);
}

function normalizeProduct(row: Record<string, string>): Product | null {
  const id = clean(row.id);
  const title = clean(row.title);
  const image = clean(row.image);

  if (!id || !title) {
    return null;
  }

  return {
    id,
    title,
    category: clean(row.category) || "未分類",
    water: clean(row.water),
    color: clean(row.color),
    price: formatPrice(clean(row.price)),
    size: clean(row.size),
    weight: clean(row.weight),
    certificate: clean(row.certificate),
    status: normalizeStatus(clean(row.status)),
    image,
    images: splitImages(clean(row.images)),
    description: clean(row.description),
    story: clean(row.story),
    available: parseAvailable(row.available),
  };
}

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  const [headerRow, ...dataRows] = rows.filter((entry) => entry.some((value) => value.trim()));
  if (!headerRow) return { headers: [], map: <T>() => [] as T[] };

  const headers = headerRow.map((header) => header.replace(/^\uFEFF/, "").trim().toLowerCase());
  const records = dataRows.map((dataRow) =>
    headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = dataRow[index] ?? "";
      return record;
    }, {}),
  );

  return {
    headers,
    map: <T>(callback: (row: Record<string, string>) => T) => records.map(callback),
  };
}

function hasRequiredHeaders(headers: string[]) {
  return REQUIRED_HEADERS.every((header) => headers.includes(header));
}

function clean(value: string | undefined) {
  return (value ?? "").trim();
}

function normalizeStatus(status: string): ProductStatus {
  if (VALID_STATUSES.includes(status as ProductStatus)) {
    return status as ProductStatus;
  }

  return "可洽購";
}

function formatPrice(price: string) {
  if (!price) return "價格洽詢";

  const numeric = Number(price.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return price;
  }

  return `NT$ ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(numeric)}`;
}

function splitImages(images: string) {
  if (!images) return [];

  return images
    .split(",")
    .map((image) => image.trim())
    .filter(Boolean);
}

function parseAvailable(value: string | undefined) {
  const normalized = clean(value).toLowerCase();
  if (!normalized) return true;

  return !["false", "0", "no", "n", "否", "下架", "停售"].includes(normalized);
}
