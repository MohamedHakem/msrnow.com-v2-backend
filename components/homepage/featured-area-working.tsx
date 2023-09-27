// import { db } from '@/lib/db';
import { getLocalArabicFromTimestamp as getTimeAgo } from '@/utils/convertTimestampToCustomLocalArabicTime';
import Image from 'next/image';
import Link from 'next/link';
// import LikesCounter from '@/components/likes-counter';
import CategorySectionSidebar from '@/components/category-section-sidebar';
import { getTopHeadlineArticles } from '@/data/getArticles';
import NextImage from '@/components/NextImage';

export default async function FeaturedArea() {
  const articles = await getTopHeadlineArticles(12);
  // articles.map((a) => console.log('articles a.published_at: ', a.published_at));

  const latestArticle = articles[0];
  const width = 768; // 750;
  const height = 460; // 450;
  const imgUrl = latestArticle.google_thumb.replace(/=s0-w\d+/, `=s0-w${1024}`).replace(/-h\d+/, `-h${614}`);

  return (
    <section dir="rtl" className="flex flex-col laptop:flex-row w-full gap-4 h-auto">
      <div className={`flex flex-col flex-auto laptop:max-w-3xl gap-4 md:gap-6 laptop:gap-10`}>
        <div className="flex flex-col w-full">
          <Link href={`/news/${latestArticle.short_slug}`}>
            <figure className="relative overflow-hidden w-full h-full laptop:h-auto">
              <Image
                unoptimized
                src={imgUrl}
                alt={latestArticle.title}
                width={1024}
                height={614}
                // className={`min-w-full md:top-1/2 md:absolute md:-mt-56 laptop:h-80`}
                // className={`min-w-full md:px-4 h-48 md:h-72`}
                className={`min-w-full md:px-4 h-48 md:h-72 laptop:h-[460px]`}
              />
            </figure>
            <p className="pt-2 pb-2 px-4 text-[22px] md:text-3xl laptop:text-3xl font-extrabold md:leading-[48px] hover:text-red-500">
              {latestArticle.title}
            </p>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-4 mobilemd:px-4">
          {articles.slice(1, 3).map((a, i) => (
            <Link
              key={i}
              href={`/news/${a.short_slug}`}
              className="flex flex-col w-full mobilemd:flex-row md:w-1/2 md:flex-col gap-3 md:gap-0"
            >
              <div className="w-full mobilemd:w-1/2 md:w-full">
                <NextImage article={a} width={width / 2} />
              </div>
              <div className="flex flex-col w-full mobilemd:w-1/2 md:w-full px-4 mobilemd:px-0">
                <p className="md:pt-2 pb-0 text-[14px] md:text-[22px] font-bold hover:text-red-500">{a.title}</p>
                <span
                  className="text-[12px] md:text-xs text-gray-400 font-semibold mt-1"
                  title={getTimeAgo(a.published_at, true, false)}
                >
                  {getTimeAgo(a.published_at, false, true)}
                </span>
              </div>
            </Link>
          ))}
        </div>
        {/* <div className="flex flex-col tablet:flex-row justify-between gap-2 md:gap-4 px-4"> */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-2 md:gap-4 px-4">
          {articles.slice(3).map((a, i) => (
            <Link
              href={`/news/${a.short_slug}`}
              key={i}
              // className="flex flex-row w-full tablet:flex-col tablet:w-1/3 gap-3 tablet:gap-0"
              className="flex flex-row w-full tablet:flex-col gap-3 tablet:gap-0"
            >
              <div className="w-2/5 tablet:w-full overflow-hidden rounded-sm">
                <NextImage article={a} width={width / 3} />
              </div>
              <p className="flex items-center w-3/5 tablet:w-full tablet:pt-2 text-[14px] tablet:text-xl font-bold hover:text-red-500">
                {a.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-row laptop:w-1/3 tablet:min-w-[180px] laptop:flex-col desktop:min-w-[220px] justify-between gap-1 rounded-md border p-4">
        {articles.slice(6).map((a, i) => (
          <Link
            href={`/news/${a.short_slug}`}
            key={i}
            // className="flex flex-row w-full tablet:flex-col tablet:w-1/3 gap-3 tablet:gap-0"
            className="flex flex-row w-full tablet:flex-col gap-3 tablet:gap-0"
          >
            <div className="w-2/5 tablet:w-full overflow-hidden rounded-sm">
              <NextImage article={a} width={width / 3} />
            </div>
            <p className="flex items-center w-3/5 tablet:w-full tablet:pt-2 text-[14px] tablet:text-xl font-bold hover:text-red-500">
              {a.title}
            </p>
          </Link>
        ))}
        {/* <CategorySectionSidebar /> */}
      </div>
    </section>
  );
}

{
  /* <div className="flex flex-row justify-between px-2">
            <span title={getTimeAgo(latestArticle.published_at, true, false)}>
              {getTimeAgo(latestArticle.published_at, false, true)}
            </span>
            {latestArticle.views && latestArticle.views > 0 ? <span>{latestArticle.views} مشاهدة</span> : null}
            <LikesCounter slug={latestArticle.short_slug} likes={latestArticle.likes} />
          </div> */
}
