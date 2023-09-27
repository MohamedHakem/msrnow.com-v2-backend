import { db } from '@/lib/db';

export const revalidate = 300 * 12; // 1hour cache

export default async function getArticle(slug: string) {
  slug = decodeURIComponent(slug);
  // const article = await db.article.update({
  // data: { views: { increment: 1 } },
  try {
    const article = await db.article.findUnique({
      where: {
        ...(slug.length < 5 ? { short_slug: slug } : { slug: slug })
      },
      select: {
        title: true,
        short_slug: true,
        slug: true,
        content: true,
        google_thumb: true,
        article_google_url: true,
        article_source_url: true,
        related_coverage_url: true,
        related_coverage_article: true,
        related_coverage_tweets: true,
        keywords: true,
        description: true,
        likes: true,
        shares: true,
        published_at: true,
        sourceId: true,
        categoryId: true
      }
    });

    return article;
  } catch (error) {
    console.log(`[getArticle] [Error] slug: ${slug}, error: ${error}`);

    return null;
  }
}
