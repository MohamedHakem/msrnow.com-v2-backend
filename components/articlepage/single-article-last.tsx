import IncrementViewCounter from '@/components/increment-view-counter';
import ViewCounter from '@/components/view-counter';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ArticleRenderer from '@/components/article-renderer';
import RelatedTimeline from '@/components/articlepage/related-timeline';
import { singleArticleType } from '@/types';
// import { Tweet } from 'react-tweet';
// import { Suspense } from 'react';
import ArticleRendererSSR from '@/components/article-renderer-ssr';
import { Suspense } from 'react';

// type singleArticle = {
//   title: string;
//   slug: string;
//   content: string | null;
//   google_thumb: string;
//   article_google_url: string;
//   article_source_url: string | null;
//   related_coverage_url: string | null;
//   likes: number | null;
//   shares: number | null;
//   short_slug: string;
//   published_at: Date;
//   keywords: string | null;
//   description: string | null;
// };

export default async function SingleArticle({ article }: { article: singleArticleType }) {
  const arr = new Array(5).fill(1);
  const body = new Array(30).fill(1);
  // console.log('article.content: ', article.content);
  // console.log('article.article_source_url: ', article.article_source_url);

  // if article_source_url is empty/null, go scrape it and scrape the content
  // if (article.article_source_url ? article.article_source_url.length < 5 : true) {
  //   console.log('article_source_url is empty, gonna scrape');
  //   const myarticle = await fetch(`/api/scrape/article/${article.slug}`);
  //   console.log('myarticle: ', myarticle);
  // }

  // console.log('article.content: ', article.content);

  const width = 768;
  const height = 420;
  const imgUrl = article.google_thumb.replace(/=s0-w\d+/, `=s0-w${width}`).replace(/-h\d+/, `-h${height}`);
  // console.log('article.google_thumb: \n', article.google_thumb);
  // console.log('imgUrl: \n', imgUrl);

  return (
    <div className="flex flex-col flex-auto gap-2 rounded-md border items-center p-4">
      <IncrementViewCounter slug={article.slug} />
      <div dir="rtl" className="flex flex-col laptop:flex-row w-full p-2 rounded-md border">
        {/* Article small Sidebar 1 (light components ONLY, bcoz will duplicate this for diff screens) */}
        <div className="hidden laptop:flex flex-col laptop:max-w-[200px] justify-between gap-1 rounded-md border m-4 laptop:m-0 p-2 h-full laptop:w-[150px]">
          {arr.map((a, i) => (
            <p key={i} className="h-full w-full bg-gray-100 dark:bg-stone-700"></p>
          ))}
        </div>

        {/* Article */}
        <div className="flex flex-col flex-auto border mx-4 rounded-md px-4 py-12">
          {/* Article Header */}
          <div className="flex flex-col max-w-3xl border p-4 rounded-md">
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <ViewCounter slug={article.slug} />
            {/* <Image src={article.google_thumb} width={280} height={168} alt={article.title} /> */}
            <AspectRatio ratio={5 / 3} className="overflow-hidden">
              <Image
                // src={article.google_thumb}
                src={imgUrl}
                // width={280}
                // height={168}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt={article.title}
                className="object-cover hover:scale-105 transition-all duration-300 ease-in-out"
                quality={100}
              />
            </AspectRatio>
          </div>
          <div className="w-4/5 mx-auto my-8 border-t"></div>
          {/* Article Body */}
          <div className="flex flex-col justify-between gap-1 w-full h-[100%] max-w-2xl rounded-md border p-2 m-auto">
            {/* {article.content ? (
            {/* use Suspense to wrap an async component, that you need to send the UI even if it's still processing on the server, so remove the below since it's not async */}
            {/* <ArticleRenderer html={article.content} /> */}
            {/* {console.log('article.article_source_url: ', article.article_source_url)} */}
            {article.content ? (
              <ArticleRendererSSR html={article.content} />
            ) : (
              <iframe
                src={article.article_source_url ? article.article_source_url : ''}
                width={'100%'}
                height={'500px'}
              ></iframe>
            )}
            {/* ) : null} */}
            {/* {body.map((a, i) => (
              <p key={i} className="h-full w-full bg-gray-100 dark:bg-stone-700"></p>
            ))} */}
          </div>
        </div>

        {/* Article small Sidebar 1-1 (light components ONLY, bcoz will duplicate this for diff screens) */}
        <div
          className="flex laptop:hidden flex-row laptop:flex-col laptop:max-w-[200px] justify-between gap-1 rounded-md border 
              m-4 laptop:mx-0 p-2 h-full laptop:w-[150px]"
        >
          {arr.map((a, i) => (
            <p key={i} className="h-8 laptop:h-full w-full bg-gray-100 dark:bg-stone-700"></p>
          ))}
        </div>
        {/* Article small Sidebar 2 */}
        <div
          className="flex flex-row laptop:flex-col laptop:max-w-[200px] justify-between gap-1 rounded-md border 
              m-4 laptop:m-0 p-2 h-full laptop:w-[150px]"
        >
          {arr.map((a, i) => (
            <p key={i} className="h-8 laptop:h-full w-full bg-gray-100 dark:bg-stone-700"></p>
          ))}
        </div>
      </div>
      <div className="w-full my-4 border-t p-2">
        {article.related_coverage_url || article.related_coverage_article ? (
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
        )}
      </div>
      {/* the above line only displays the related TIMELINE of coverage news+tweets around the main news */}
      {/* you still need to make a wrapper related component for all related-articles sections, RelatedTimeline is just one of them */}
    </div>
  );
}
