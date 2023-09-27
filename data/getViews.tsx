import { db } from '@/lib/db';

export default async function getViewsBySlug(slug: string) {
  slug = decodeURIComponent(slug)
  try {
    const res = await db.article.findUnique({
      where: { slug: slug },
      select: { views: true }
    });

    return !res ? 0 : Number(res.views);
  } catch (error) {
    console.log(`[getViewsBySlug] [Error] slug: [${slug}], error: ${error}`);
    return `[getViewsBySlug] [Error] slug: [${slug}], error: ${error}`;
  }
}
