import { db } from '@/lib/db';

export const revalidate = 300; // 5min cache

export async function getLatestArticles(num: number) {
  try {
    const res = await db.article.findMany({
      select: {
        title: true,
        short_slug: true,
        slug: true,
        likes: true,
        shares: true,
        published_at: true,
        google_thumb: true,
        article_google_url: true,
        article_source_url: true
      },
      orderBy: {
        published_at: 'desc'
      },
      take: num
    });

    return res;
  } catch (error) {
    console.log(`[getLatestArticles] [Error] num [${num}], error: ${error}`);

    return null;
  }
}

export async function getMostViewedArticles(num: number) {
  // most viewed articles of all time, include another argument for period "day", or "week", or "month"
  // and take it to the prisma call to filter based on it now-day/now-week/now-month, with a WHERE clause on the published_at or something like that
  try {
    const res = await db.article.findMany({
      select: {
        title: true,
        short_slug: true,
        slug: true,
        google_thumb: true,
        article_google_url: true,
        article_source_url: true,
        likes: true,
        shares: true,
        published_at: true
      },
      orderBy: {
        views: 'desc'
      },
      take: num
    });

    return res;
  } catch (error) {
    console.log(`[getMostViewedArticles] [Error] num [${num}], error: ${error}`);

    return null;
  }
}

export async function getRelatedArticles(short_slugs: string[]) {
  try {
    const res = await db.article.findMany({
      where: {
        short_slug: {
          in: short_slugs
        }
      },
      select: {
        title: true,
        short_slug: true,
        slug: true,
        likes: true,
        shares: true,
        published_at: true,
        google_thumb: true,
        article_google_url: true,
        article_source_url: true,
        related_coverage_article: true,
        related_coverage_url: true,
        related_coverage_tweets: true,
        categoryId: true,
        sourceId: true,
        scraped_from: true
      }
    });

    return res;
  } catch (error) {
    console.log(`[getLatestArticles] [Error] short_slugs: [${short_slugs}], error: ${error}`);
    return null;
  }
}

export async function getTopHeadlineArticles(num: number) {
  return await db.article.findMany({
    where: { top_headline: true },
    select: {
      title: true,
      short_slug: true,
      likes: true,
      views: true,
      published_at: true,
      google_thumb: true,
      categoryId: true
    },
    orderBy: {
      published_at: 'desc'
    },
    take: num
  });
}

export async function getLatestCategoryArticles(category: string, num: number) {
  return await db.category.findMany({
    where: { name: category },
    include: {
      articles: {
        where: {
          NOT: {
            related_coverage_url: ''
          }
        },
        select: {
          title: true,
          short_slug: true,
          likes: true,
          views: true,
          published_at: true,
          google_thumb: true,
          categoryId: true,
          related_coverage_tweets: true,
          related_coverage_article: true,
          related_coverage_url: true
        },
        orderBy: { published_at: 'desc' },
        take: num
      }
    }
  });
}

// : Promise<{
//   articles: {
//     title: string;
//     google_thumb: string;
//     views: number | null;
//     likes: number | null;
//     short_slug: string;
//     categoryId: number;
//     published_at: Date;
//   }[];
// }>
