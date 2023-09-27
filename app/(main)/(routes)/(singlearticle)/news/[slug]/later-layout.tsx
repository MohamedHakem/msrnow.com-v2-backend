// import IncrementViewCounter from '@/components/increment-view-counter';

import SingleArticle from '@/components/articlepage/single-article';
import getArticle from '@/data/getArticle';
import { Suspense } from 'react';

// {
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: { slug: string };
// })

export default async function SingleArticleLayout(props: { children: React.ReactNode; related: React.ReactNode }) {
  // const { slug } = params;
  // let article = await getArticle(decodeURIComponent(slug));
  // console.log('🚀 SingleArticleLayout ~ article:', article);
  const arr2 = new Array(20).fill(1);

  return (
    <div>
      <div>Hello from SingleArticleLayout</div>
      {/* a new article is open, you have 2 slots
        - the articleContent
        - the related articles(+tweets)

      */}

      <div className="flex flex-col md:flex-row rounded-md gap-4 p-4 pl-5 laptop:pr-0 scroll-m-0">
        {props.related}
        {/* Article header and content */}
        <Suspense fallback={<div>LOADING ARTICLE CONTENT</div>}>
          {/* {article ? <SingleArticle article={article} /> : <></>} */}
        </Suspense>
        {/* article main sidebar */}
        <div className="flex flex-row md:flex-col justify-between gap-1 tablet:min-w-[180px] desktop:min-w-[220px] rounded-md border p-2">
          {arr2.map((a, i) => (
            <p key={i} className="h-16 laptop:h-full w-full bg-gray-100 dark:bg-stone-700"></p>
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-auto gap-2 rounded-md border items-center p-4">
        {/* <IncrementViewCounter slug={article.slug} /> */}
        <Suspense fallback={<div>LOADING ARTICLE CONTENT</div>}>{props.children}</Suspense>
        {/* The related section, including the timeline */}
        <div className="w-full my-4 border-t p-2">
          {/* {article.related_coverage_url || article.related_coverage_article ? (
        <Suspense fallback={<p className="h-72 w-full bg-gray-100">Loading</p>}>
          <RelatedTimeline
            related_coverage_url={article.related_coverage_url}
            related_coverage_article={article.related_coverage_article}
            related_coverage_tweets={article.related_coverage_tweets}
            short_slug={article.short_slug}
            categoryId={article.categoryId}
          />
        </Suspense>
      ) : (
        ''
      )} */}
          {/* the above line only displays the related TIMELINE of coverage news+tweets around the main news */}
          {/* you still need to make a wrapper related component for all related-articles sections, RelatedTimeline is just one of them */}
        </div>
      </div>
    </div>
  );
}
