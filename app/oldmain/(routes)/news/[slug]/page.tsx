import ViewCounter from '@/components/view-counter';
import getArticle from '@/data/getArticle';
import MostViewedArticles from '@/components/most-viewed-articles';
import IncrementViewCounter from '@/components/increment-view-counter';
import Image from 'next/image';

export default async function Article({ params }: { params: { slug: string } }) {
  const article = await getArticle(decodeURIComponent(params.slug));

  if (article === null) return <></>;
  return (
    <div className="m-auto max-w-6xl border-2">
      {/* client comp to increment views even on soft navigation */}
      <IncrementViewCounter slug={article.slug} />

      <div dir="rtl" className="border p-4 m-2 flex flex-col">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <ViewCounter slug={article.slug} />
        <Image src={article.google_thumb} width={280} height={168} alt={article.title} />
        {/* [{article?.short_slug}] */}
      </div>
      <div className="mt-8">
        <MostViewedArticles num={4} />
        <MostViewedArticles num={4} />
        {/* TODO: <MostViewedArticles /> Across all News of the day */}
        {/* TODO: <MostViewedArticles /> Across all News of the week (+ month, later) */}
        {/* TODO: <RelatedTopCoverageArticles num={4} /> // I'll probably only scrape/get 4 maximum */}
        {/* TODO: <RelatedFullCoverageArticles num={4} /> // I'll probably only scrape/get 4 maximum  */}
        {/* TODO: <RelatedTweets num={4} /> // I'll probably only scrape/get 4 tweets ids, put it in a related_tweets array */}

        {/* TODO: <LatestNewsArticles num={4} /> // 4 is enough considering the rest */}
        {/* TODO: <RelatedCategoryArticles num={4} /> // across all category, for the day/week, by top views and latest.. views is better */}
        {/* TODO: <MostViewedVideos num={4} /> // still not sure how to calculate the view.. maybe as an article/video page! */}
        {/* TODO: <PUTOSLatestNews num={4} /> // oh yeah */}
        {/* TODO: auto-infinite-load the next most-viewed article of the category (url/router change), oh yeah */}
      </div>
    </div>
  );
}

// consider calling the action directly into the article page wihtout any useEffect (re-render handling) since it's a RSC and it will only render once, test to make sure
