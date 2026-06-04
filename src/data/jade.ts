export type CollectionStatus = "可洽購" | "預約中" | "已售出" | "私人留藏";

export type CollectionItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  grade: string;
  color: string;
  size: string;
  weight: string;
  certificate: string;
  price: string;
  status: CollectionStatus;
  story: string;
  tags: string[];
};

export const collections: CollectionItem[] = [
  {
    id: "imperial-bangle",
    title: "帝王綠正圈手鐲",
    category: "手鐲",
    image: "/images/jade-bangle.png",
    grade: "玻璃種",
    color: "帝王綠，色正且飽和",
    size: "內徑 56.8 mm，條寬 12.4 mm，厚 9.1 mm",
    weight: "78.6 g",
    certificate: "GIA Jadeite Report JA-2026-001，天然 A 貨翡翠，未見處理跡象。",
    price: "NT$ 16,800,000",
    status: "可洽購",
    story:
      "厚莊正圈，色根集中卻不沉暗，光線下可見柔和起螢。適合重視圈口、厚度與滿色完整度的高端藏家。",
    tags: ["玻璃種", "滿色", "A 貨"],
  },
  {
    id: "green-cabochon",
    title: "陽綠蛋面鑽戒",
    category: "蛋面",
    image: "/images/jade-cabochon-ring.png",
    grade: "高冰種",
    color: "陽綠，明度高，色帶集中",
    size: "蛋面 14.2 x 11.1 x 6.8 mm，戒圍 HK 13",
    weight: "主石約 5.4 ct，總重 8.9 g",
    certificate: "NGTC Jadeite Identification J-26014，天然翡翠，貴金屬鑲嵌。",
    price: "NT$ 3,280,000",
    status: "可洽購",
    story:
      "蛋面弧度飽滿，台面光感集中，戒台比例克制。適合作為日常佩戴與正式場合皆能成立的精品收藏。",
    tags: ["高冰", "陽綠", "蛋面"],
  },
  {
    id: "guanyin-pendant",
    title: "冰種觀音牌",
    category: "雕件",
    image: "/images/jade-guanyin.png",
    grade: "冰種",
    color: "淡晴綠，底色均勻",
    size: "52.0 x 34.5 x 7.6 mm",
    weight: "31.2 g",
    certificate: "HKJSL Jadeite Report HK-26077，天然 A 貨翡翠，手工雕刻。",
    price: "NT$ 880,000",
    status: "預約中",
    story:
      "留料完整，雕工採低浮雕處理，面相柔和，薄處透光。收藏價值來自材質乾淨度與工藝敘事。",
    tags: ["冰種", "雕件", "晴綠"],
  },
  {
    id: "lavender-pendant",
    title: "冰紫飄翠吊墜",
    category: "吊墜",
    image: "/images/jade-lavender-pendant.png",
    grade: "冰糯種",
    color: "淡紫羅蘭底，局部飄陽綠",
    size: "38.6 x 24.4 x 8.2 mm",
    weight: "16.8 g",
    certificate: "TGL Jadeite Certificate TGL-26-118，天然翡翠，18K 金扣頭。",
    price: "NT$ 468,000",
    status: "可洽購",
    story:
      "紫底與飄翠形成柔和對比，適合作為年輕藏家偏好的日常佩戴級收藏。重點在底子清爽與色彩分布。",
    tags: ["冰糯", "紫羅蘭", "飄翠"],
  },
];

export const categories = ["全部", "手鐲", "蛋面", "雕件", "吊墜", "珠串", "擺件"];

export const knowledgeCards = [
  ["種", "晶體結構與細膩度", "玻璃種、冰種、糯冰種等分類，關注晶體顆粒、通透感、底子乾淨度與光線穿透。"],
  ["水", "透明度與靈動感", "水頭影響視覺深度與價格彈性；高端作品通常呈現柔和而內斂的光感。"],
  ["色", "濃、陽、正、勻", "帝王綠、陽綠、晴水、紫羅蘭等色系，需同時評估飽和度、明度、均勻度與色根。"],
  ["工", "比例、拋光與雕刻", "蛋面看弧度與滿色，手鐲看圈口與厚度，雕件看題材、留料與工藝層次。"],
];

export const purchaseSteps = [
  ["01", "預約賞藏", "確認藏品狀態、預約線上或私人賞藏時段。"],
  ["02", "證書與細節確認", "提供照片、尺寸、重量、證書資訊與收藏背景。"],
  ["03", "付款與交付", "確認交易條件後安排保險交付或面交。"],
];
