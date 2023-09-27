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
// import ArticleSidebar from './article-sidebar';
import ArticleHeader from './article-header';

export default async function SingleArticle({ article }: { article: singleArticleType }) {
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
