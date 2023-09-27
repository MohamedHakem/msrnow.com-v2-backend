import Link from 'next/link';
import { getLatestArticles } from '@/data/getArticles';
import NextImage from '@/components/NextImage';
import { getLocalArabicFromTimestamp as getTimeAgo } from '@/utils/convertTimestampToCustomLocalArabicTime';
import AdSection from '@/components/ad-section';

export default async function LatestNewsPage() {
  console.time('getLatestArticles(48)');
  const news = await getLatestArticles(30);
  console.timeEnd('getLatestArticles(48)');
  console.log('inside LatestNewsPage');
  if (!news) return null;

  //
  // add filters for this page, so he can filter by category!! and time as well
  // (sort top/most-viewed/latest OR leave those for diff pages, and filter on category here and other things )
  //
  // Latest is not a category, it's just a sorting mechanism. Top-headlines is similar, you could consider it as both, the rest ARE CATEGORIES
  // And for the rest, you can make sections like Top-headlines, Latest, Most-Viewed or Trending, etc, except for these "Latest" category
  //
  return (
    <div className="flex flex-col gap-4 py-8 px-4">
      <h1 className="text-3xl font-bold">أخر الأخبار</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="h-full pb-4 lg:col-span-2">
          <div className="w-full overflow-hidden rounded-lg">
            <ul>
              {news.map((article, i) => (
                <li key={i} className="flex flex-col py-2">
                  <Link href={`/news/${article.short_slug}`} className="flex flex-row gap-3 md:gap-4 w-full">
                    <div className="w-1/2 md:w-[280px] h-fit">
                      <NextImage article={article} width={null} />
                    </div>
                    <div className="flex-col w-1/2 md:w-2/3">
                      <h4 className="text-sm md:text-lg laptop:text-xl font-bold text-gray-900 leading-5 hover:text-red-500">
                        {article.title}
                      </h4>
                      <div className="mt-1 text-xs text-gray-400">
                        <time>{getTimeAgo(article.published_at, false, true)}</time>
                      </div>
                    </div>
                  </Link>
                  {i >= 4 && i % 6 === 0 ? <AdSection size={'medium'} /> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="h-32 md:h-40 laptop:h-80 sticky top-8 rounded-md bg-gray-50"></div>
      </div>
    </div>
  );
}
