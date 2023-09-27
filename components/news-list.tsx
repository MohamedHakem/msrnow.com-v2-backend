import NewsCard from '@/components/cards/news-card';
// most viewed articles of all time, include another argument for period "day", or "week", or "month" and take it to the prisma call to filter based on it now-day/now-week/now-month
export default async function NewsList({
  newsArticles
}: {
  newsArticles:
    | {
        title: string;
        slug: string;
        google_thumb: string;
        article_google_url: string;
        article_source_url: string | null;
        likes: number | null;
        shares: number | null;
        short_slug: string;
        published_at: Date;
      }[]
    | null;
}) {
  return (
    <div className="border p-2">
      <div
        dir="rtl"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 m-auto gap-4 md:gap-4 text-neutral-600 dark:text-neutral-400"
      >
        {newsArticles === null ? <></> : 
        newsArticles.map((p, i) => <NewsCard key={i} article={p} />)}
      </div>
    </div>
  );
}
