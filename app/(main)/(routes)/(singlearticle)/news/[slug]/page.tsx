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
import RelatedTimeline from '@/components/articlepage/related-timeline';
import ArticleRendererSSR from '@/components/article-renderer-ssr';
import ArticleSettingSidebar from '@/components/articlepage/article-settings-sidebar';
import ArticleHeader from '@/components/articlepage/article-header';
import IncrementViewCounter from '@/components/increment-view-counter';
// import RelatedTimeline from '@/components/articlepage/related-timeline';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  console.log('inside ArticlePage');

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

  // return (
  //   // <Suspense
  //   //   fallback={
  //   //     <div className="w-full h-screen">
  //   //       <SingleArticleSkeleton />
  //   //     </div>
  //   //   }
  //   // >
  //   <SingleArticle article={article} />
  //   // </Suspense>
  // );

  // Re-think this model. Instead of (fetching article from db by slug, scrape article content and save to db, scrape related articles)
  // what about, 
      // 1- cache using fetch call
      // 2- if not in cache, get article from db and cache, 
      // 3- pass article to articleHeader, articleBody, and relatedTimeline 
      // 4- inside articleBody, if content exist render with ArticleRendererSSR, if not => go scrape 
      // 5- inside relatedTimeline, if article.related_coverage_article exist => render, 
          // if not but article.related_coverage_url exist => go scrape 

  return (
    <div
      dir="rtl"
      className="flex flex-col flex-auto laptop:flex-row w-full items-center
      transition-all duration-200 ease-in-out"
    >
      <IncrementViewCounter slug={article.slug} />
      <div className="flex flex-col laptop:flex-row justify-between flex-auto">
        <div className="flex flex-col laptop:w-2/3 desktop:flex-auto max-w-[650px] gap-4">
          <ArticleHeader article={article} />
          <ArticleSettingSidebar />
          <div className="flex flex-col gap-2 w-full h-auto rounded-md p-4 mx-auto">
            <Suspense fallback={<div className="w-full p-4 mx-auto">ArticleRendererSSR or iframe is LOADING</div>}>
              {article.content ? (
                <ArticleRendererSSR html={article.content} />
              ) : (
                <iframe
                  className="bg-gray-100 w-full h-[500px]"
                  src={article.article_source_url ? article.article_source_url : ''}
                  width={'100%'}
                  height={'500px'}
                />
              )}
            </Suspense>
          </div>
        </div>
        <div className="flex flex-col laptop:w-1/3">
          <Suspense fallback={<div className="w-full p-4 mx-auto">RelatedTimeline is LOADING</div>}>
            {article.related_coverage_url || article.related_coverage_article ? (
              <RelatedTimeline
                related_coverage_url={article.related_coverage_url}
                related_coverage_article={article.related_coverage_article}
                related_coverage_tweets={article.related_coverage_tweets}
                short_slug={article.short_slug}
                categoryId={article.categoryId}
              />
            ) : null}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

//
// Currently the minimum width for my site is 480px (250px mimimum for the tweet component + 214px padding!)
// When I remove all the unnecessary padding (214px), the minimum width (phone screen resolution) will become 270px WHICH IS GREAT
//
