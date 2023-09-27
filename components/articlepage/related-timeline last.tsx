import ScrapeRelatedArticles from '@/utils/scrapeRelatedNews';
import { Tweet } from 'react-tweet';
// import Timeline from '@/components/timeline-old';
// import Timeline from '@/components/timeline-old-2';
import Timeline from '@/components/timeline';
import { relatedArticleType } from '@/types';
import { getRelatedArticles } from '@/data/getArticles';

export default async function RelatedTimeline({
  related_coverage_url,
  related_coverage_article,
  related_coverage_tweets,
  short_slug,
  categoryId
}: {
  related_coverage_url: string | null;
  related_coverage_article: string | null;
  related_coverage_tweets: string | null;
  short_slug: string;
  categoryId: number;
}) {
  console.log('🚀 related-timeline categoryId:', categoryId);
  console.log('🚀 related-timeline short_slug:', short_slug);
  console.log('🚀 related-timeline related_coverage_tweets:', related_coverage_tweets);
  console.log('🚀 related-timeline related_coverage_article:', related_coverage_article);
  console.log('🚀 related-timeline related_coverage_url:', related_coverage_url);
  // console.time('START: RelatedTimeline');
  // console.log(
  //   'related_coverage_url | related_coverage_article | related_coverage_tweets | short_slug | categoryId: ',
  //   related_coverage_url,
  //   '\n',
  //   related_coverage_article,
  //   '\n',
  //   related_coverage_tweets,
  //   '\n',
  //   short_slug,
  //   '\n',
  //   categoryId
  // );
  // console.log('🚀 ~ file: related-timeline.tsx:16 ~ related_coverage_url:', related_coverage_url);
  // console.log('[RelatedTimeline] related_coverage_url: ', related_coverage_url);

  // call fetch("/api/scrape/related/${related_coverage_url}"), do the scraping and saving new related news there, return a list of related news

  // check if the it's scraped already, if yes ignore, if no go scrape the tweets/articles and save, return them here as well.
  let relatedArticles: relatedArticleType[] = [];
  let relatedTweets: string[] | null = [];

  related_coverage_article === null
    ? console.log('related_coverage_article is null')
    : related_coverage_article === ''
    ? console.log("related_coverage_article is '' ")
    : null;

  // SCRAPE IF you don't have the related_coverage_article and you have related_coverage_url
  if (related_coverage_url && related_coverage_article == '') {
    console.log('[Start] Ive got related_coverage_url, ScrapeRelatedArticles...');
    console.time('[TIME] ScrapeRelatedArticles');
    relatedArticles = await ScrapeRelatedArticles(related_coverage_url, short_slug, categoryId);
    console.timeEnd('[TIME] ScrapeRelatedArticles');
    console.log('relatedArticles[0]: ', relatedArticles[0]);
    // relatedTweets = relatedArticles[0].related_coverage_tweets.split(',');
    relatedTweets = relatedArticles[0].related_coverage_tweets
      ? relatedArticles[0].related_coverage_tweets.split(',')
      : null;
    console.log('[DONE] ScrapeRelatedArticles... FINISHED');
    // console.log('🚀 ~ file: related-timeline.tsx:24 ~ relatedTweets:', relatedTweets, ' - ', relatedTweets?.length);
  } else {
    console.log('getRelatedArticle from db...');
    // get the articles from db, and just format the tweets from string to string[]
    console.time('[TIME] getRelatedArticles from db');
    const relatedArticleFromDb = related_coverage_article
      ? await getRelatedArticles(related_coverage_article.split(','))
      : [];
    console.timeEnd('[TIME] getRelatedArticles from db');

    if (relatedArticleFromDb) {
      relatedArticles = relatedArticleFromDb.filter(
        (a) => relatedArticleFromDb[0].published_at.getMonth() === a.published_at.getMonth()
      );
      console.log('🚀 ~ file: related-timeline.tsx:89 ~ relatedArticles:', relatedArticles.length);

      relatedTweets = relatedArticles[0].related_coverage_tweets
        ? relatedArticles[0].related_coverage_tweets.split(',')
        : related_coverage_tweets
        ? related_coverage_tweets.split(',')
        : null;
    }
  }

  if (relatedArticles.length > 0) {
    return (
      <div>
        <Timeline relatedTweets={relatedTweets} relatedArticles={relatedArticles} />
      </div>
    );
  } else {
    return null;
  }
}
