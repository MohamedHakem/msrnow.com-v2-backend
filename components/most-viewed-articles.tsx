import { getMostViewedArticles } from '@/data/getArticles';
import NewsList from './news-list';
// most viewed articles of all time, include another argument for period "day", or "week", or "month" and take it to the prisma call to filter based on it now-day/now-week/now-month

export default async function MostViewedArticles({ num }: { num: number }) {
  const articles = await getMostViewedArticles(num);

  if (articles === null) return <></>;

  return (
    <div dir="rtl" className="flex flex-col gap-2 m-2">
      <h2 className="font-bold text-2xl">الاعلي قراءة</h2>
      <NewsList newsArticles={articles} />
    </div>
  );
}
