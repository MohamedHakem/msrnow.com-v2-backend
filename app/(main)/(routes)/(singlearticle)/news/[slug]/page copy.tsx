// import ViewCounter from '@/components/view-counter';
import getArticle from '@/data/getArticle';
import MostViewedArticles from '@/components/most-viewed-articles';
// import IncrementViewCounter from '@/components/increment-view-counter';
// import Image from 'next/image';
import SingleArticle from '@/components/articlepage/single-article';
import ScrapeArticleContent from '@/utils/scrapeArticleContent';
import { Await } from '@/components/await';
import { Suspense } from 'react';
import SingleArticleSkeleton from '@/components/skeletons/single-article-skeleton';
// import RelatedTimeline from '@/components/articlepage/related-timeline';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  console.log('[Article] slug:', decodeURIComponent(slug));
  let article = await getArticle(decodeURIComponent(params.slug));

  if (article === null) return <SingleArticleSkeleton />;

  // if article_source_url is empty/null, go SCRAPE it and scrape the content
  if (article.article_source_url ? article.article_source_url.length < 5 : true) {
    console.log('[ArticlePage] article_source_url is empty, gonna scrape it and the content, keywords, description');
    const updatedArticle = await ScrapeArticleContent(article);
    article = updatedArticle ? updatedArticle : article;
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-screen">
          <SingleArticleSkeleton />
        </div>
      }
    >
      <SingleArticle article={article} />
    </Suspense>
  );
}

//
// Currently the minimum width for my site is 480px (250px mimimum for the tweet component + 214px padding!)
// When I remove all the unnecessary padding (214px), the minimum width (phone screen resolution) will become 270px WHICH IS GREAT
//
