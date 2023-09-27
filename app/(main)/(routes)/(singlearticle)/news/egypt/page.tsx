import Link from 'next/link';
import { getLatestCategoryArticles } from '@/data/getArticles';
import NextImage from '@/components/NextImage';
import { getLocalArabicFromTimestamp as getTimeAgo } from '@/utils/convertTimestampToCustomLocalArabicTime';
import AdSection from '@/components/ad-section';
import { Tweet } from 'react-tweet';
import { tweetsArrayType } from '@/types';
import RelatedTimeline from '@/components/articlepage/related-timeline';

export default async function EgyptNewsPage() {
  console.time('getLatestCategoryArticles');
  const news = await getLatestCategoryArticles('egypt', 30).then((res) => res[0].articles);
  console.timeEnd('getLatestCategoryArticles');
  console.log('inside EgyptNewsPage');
  if (!news) return null;

  // const getTweetsArray = () => {
  //   const tweetsArray: tweetsArrayType[] = relatedTweets.map((t) => {
  //     const id = t.split('/')[0];
  //     const published_at = Number(t.split('/')[1]);
  //     return { id, published_at };
  //   });
  // };

  news.map((a, i) =>
    a.related_coverage_url
      ? console.log(
          'article.related_coverage_url: ',
          a.related_coverage_url,
          ' - ',
          i,
          '\n the related_coverage_article: ',
          a.related_coverage_article, '\n'
        )
      : console.log(
          "it's not a main news article",
          ' - ',
          i,
          '\n the related_coverage_article: ',
          a.related_coverage_article
        )
  );

  return (
    <div className="flex flex-col gap-4 py-8 px-4">
      <h1 className="text-3xl font-bold">أخبار مصر</h1>
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
                  {/* <div>
                    {article.related_coverage_url || article.related_coverage_article ? (
                      <RelatedTimeline
                        related_coverage_url={article.related_coverage_url}
                        related_coverage_article={article.related_coverage_article}
                        related_coverage_tweets={article.related_coverage_tweets}
                        short_slug={article.short_slug}
                        categoryId={article.categoryId}
                      />
                    ) : null}
                  </div> */}
                  {/* {article.related_coverage_tweets ? (
                    <div className="bg-gray-100 border p-4 mb-4">
                      {article.related_coverage_tweets.length > 5 ? 
                        ({tweetsArray.map(tweet => (
                          <Tweet id={item.id} />
                        ))} 
                    </div>
                  ) : null} */}
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
