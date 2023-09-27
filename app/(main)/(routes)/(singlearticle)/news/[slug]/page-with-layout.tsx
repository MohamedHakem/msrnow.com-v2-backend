// import ViewCounter from '@/components/view-counter';
import getArticle from '@/data/getArticle';
import MostViewedArticles from '@/components/most-viewed-articles';
// import IncrementViewCounter from '@/components/increment-view-counter';
// import Image from 'next/image';
import SingleArticle from '@/components/articlepage/single-article';
import ScrapeArticleContent from '@/utils/scrapeArticleContent';
// import RelatedTimeline from '@/components/articlepage/related-timeline';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  console.log('[Article] slug:', decodeURIComponent(slug));
  let article = await getArticle(decodeURIComponent(params.slug));
  const arr2 = new Array(20).fill(1);

  // console.log('[ArticlePage] article: ', article);

  if (article === null) return <div className="w-full h-full bg-gray-100">LOADING</div>;

  // if article_source_url is empty/null, go SCRAPE it and scrape the content
  if (article.article_source_url ? article.article_source_url.length < 5 : true) {
    console.log('[ArticlePage] article_source_url is empty, gonna scrape it and the content, keywords, description');
    // const myarticle = await fetch(`/api/scrape/article/${params.slug}`);
    const updatedArticle = await ScrapeArticleContent(article);
    article = updatedArticle ? updatedArticle : article;
    // console.log('[ArticlePage] myArticle: ', article);
  }

  return (
    <div className="flex flex-col md:flex-row rounded-md gap-4 p-4 pl-5 laptop:pr-0 scroll-m-0">
      {/* Article page */}
      {/* <SingleArticle article={article} /> */}
      {/* START Related Section (wrap in a div later) */}
      {/* <RelatedTimeline related_coverage_url={article.related_coverage_url ? article.related_coverage_url : ''} /> */}
      {/* <div>hello</div> */}
      {/* <MostViewedArticles num={4} /> */}
      {/* END Related Section */}

      {/* Next Article page here (infinite loading) */}
      {/* Article Page Main Sidebar (move this section inside each article if you want for ads or smt) */}
      <div className="flex flex-row md:flex-col justify-between gap-1 tablet:min-w-[180px] desktop:min-w-[220px] rounded-md border p-2">
        {arr2.map((a, i) => (
          <p key={i} className="h-16 laptop:h-full w-full bg-gray-100 dark:bg-stone-700"></p>
        ))}
      </div>
    </div>
  );
}

// DONE // {/* TODO: <RelatedTopCoverageArticles num={4} /> // I'll probably only scrape/get 4 maximum */}
// DONE // {/* TODO: <RelatedFullCoverageArticles num={4} /> // I'll probably only scrape/get 4 maximum  */}
// DONE // {/* TODO: <RelatedTweets num={4} /> // I'll probably only scrape/get 4 tweets ids, put it in a related_tweets array */}

// {/* TODO: <MostViewedArticles /> Across all News of the day (and tabs for week, month) */}
// {/* TODO: <TopHeadlinesArticles num={4} /> // across all categories for the day/week ?
// {/* TODO: <RelatedCategoryArticles num={4} /> // across the category, for the day (maybe week too), by top views, latest, or importance (top-headline) */}
// {/* TODO: <LatestNewsArticles num={4} /> // 4 is enough considering the rest */}

// VIDEO // {/* TODO: <MostViewedVideos num={4} /> // still not sure how to calculate the view.. maybe as an article/video page! */}
// FOOD // {/* TODO: <MostViewedFood num={4} /> // still not sure how to calculate the view.. maybe as an article/video page! */}
// SPORT section with some tabs, maybe it will catch a few views
// MARKETPLACE TOP VIEWED ITEMS (متجر) // BUY AND SELL FOR FREE NOW! (banner or small section)

// MAYBE IF FOUND // {/* TODO: <PUTOSLatestNews num={4} /> // oh yeah */}

// {/* TODO: auto-infinite-load the next most-viewed article of the category (url/router change), oh yeah */}
// consider calling the action directly into the article page wihtout any useEffect (re-render handling) since it's a RSC and it will only render once, test to make sure
