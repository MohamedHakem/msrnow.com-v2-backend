import IncrementViewCounter from '@/components/increment-view-counter';
// import ViewCounter from '@/components/view-counter';
// import Image from 'next/image';
// import { AspectRatio } from '@/components/ui/aspect-ratio';
// import ArticleRenderer from '@/components/article-renderer';
import RelatedTimeline from '@/components/articlepage/related-timeline';
import { singleArticleType } from '@/types';
import ArticleRendererSSR from '@/components/article-renderer-ssr';
import { Suspense } from 'react';
// import TimelineSkeleton from '@/components/skeletons/timeline-skeleton';
import ArticleSettingSidebar from './article-settings-sidebar';
import ArticleSidebar from './article-sidebar';
import ArticleHeader from './article-header';

export default async function SingleArticle({ article }: { article: singleArticleType }) {
  return (
    <div dir="rtl" className="flex flex-col flex-auto laptop:flex-row w-full gap-2 rounded-md border items-center p-4">
      <IncrementViewCounter slug={article.slug} />
      {/* <div dir="rtl" className="flex flex-col laptop:flex-row w-full p-2 rounded-md border"> */}
      <div className="flex flex-col desktop:flex-row justify-between flex-auto gap-16 rounded-md px-4">
        <div className="flex flex-col desktop:flex-auto laptop:w-2/3 desktop:max-w-4xl gap-4 rounded-md">
          <ArticleHeader article={article} />
          <ArticleSettingSidebar />
          {/* Article Body */}
          <div className="flex flex-col gap-2 w-full h-auto rounded-md border p-4 mx-auto">
            {article.content ? (
              <Suspense fallback={<div>ArticleRendererSSR LOADING</div>}>
                <ArticleRendererSSR html={article.content} />
              </Suspense>
            ) : (
              <Suspense fallback={<div>iframe LOADING</div>}>
                <iframe
                  src={article.article_source_url ? article.article_source_url : ''}
                  width={'100%'}
                  height={'500px'}
                ></iframe>
              </Suspense>
            )}
          </div>
        </div>
        <div className="flex flex-col laptop:w-1/3">
          {article.related_coverage_url || article.related_coverage_article ? (
            // <Suspense fallback={<TimelineSkeleton />}>
            <RelatedTimeline
              related_coverage_url={article.related_coverage_url}
              related_coverage_article={article.related_coverage_article}
              related_coverage_tweets={article.related_coverage_tweets}
              short_slug={article.short_slug}
              categoryId={article.categoryId}
            />
          ) : (
            // </Suspense>
            ''
          )}
        </div>
      </div>
      {/* <ArticleSidebar /> */}
      {/* </div> */}
    </div>
  );
}
