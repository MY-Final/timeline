/**
 * 自动扫描 src/assets/images/ 下所有 YYYY-MM-DD 子文件夹中的图片。
 * 只需把照片放入对应日期文件夹，无需手动 import。
 *
 * 用法：
 *   import { getImagesByDate, getAllDates } from '@/lib/images.ts'
 *
 *   getImagesByDate('2026-04-12')  // => ['url1', 'url2', ...]
 *   getAllDates()                  // => ['2026-04-12', '2026-05-01', ...]
 */

// Vite 构建时静态分析：匹配所有支持的图片格式
// eager: true — 同步加载，直接拿到 URL 字符串
const allImages = import.meta.glob<{ default: string }>(
  '../assets/images/**/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
)

/**
 * 从 glob 路径中提取日期文件夹名称，例如：
 * "../assets/images/2026-04-12/foo.jpg" → "2026-04-12"
 */
function extractDate(path: string): string | null {
  const match = path.match(/images\/(\d{4}-\d{2}-\d{2})\//)
  return match ? match[1] : null
}

/**
 * 按日期分组后的图片 URL 映射。
 * key:   "YYYY-MM-DD"
 * value: 该文件夹下所有图片的 URL 数组（按文件名排序）
 */
const imageMap: Record<string, string[]> = {}

for (const [path, mod] of Object.entries(allImages)) {
  const date = extractDate(path)
  if (!date) continue
  if (!imageMap[date]) imageMap[date] = []
  imageMap[date].push(mod.default)
}

// 每个日期内部按文件名排序，保证顺序一致
for (const date in imageMap) {
  imageMap[date].sort()
}

/**
 * 获取指定日期文件夹的图片 URL 数组。
 * 日期不存在时返回空数组。
 */
export function getImagesByDate(date: string): string[] {
  return imageMap[date] ?? []
}

/**
 * 返回所有已有照片的日期列表，按时间升序排列。
 */
export function getAllDates(): string[] {
  return Object.keys(imageMap).sort()
}
