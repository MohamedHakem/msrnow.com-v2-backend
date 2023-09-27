import { db } from '@/lib/db';
import { newArticlesType, relatedArticleType, sourceType } from '@/types';
import * as cheerio from 'cheerio';
import { sanitizeTitle } from '@/utils/sanitizeTitle';
import { sanitizeSlug } from '@/utils/sanitizeSlug';
import generateShortSlugs from '@/utils/generateShortSlugs';
import { sources } from '@/data/static/sources';
// const util = require('util');

export default async function ScrapeRelatedArticles(
  related_coverage_url: string,
  short_slug: string,
  categoryId: number
): Promise<relatedArticleType[]> {
  // scrape related articles, in DESCending order from google news, using related_coverage_url
  // console.log('[ScrapeRelatedArticles] related_coverage_url: ', related_coverage_url);
  // console.log('[ScrapeRelatedArticles] slug: ', slug);
  // console.log('[ScrapeRelatedArticles] categoryId: ', categoryId);

  // const page = await fetch(`${related_coverage_url}&so=1`).then((res) => res.text());
  // const $ = cheerio.load(page, { xmlMode: true });

  console.time('relateCoverage get Route');

  console.time('tweetsPage and $tweets');
  console.log('related_coverage_url: ', related_coverage_url);
  const tweetsPage = await fetch(related_coverage_url, { cache: 'no-cache' }).then((res) => res.text());
  const $tweets = cheerio.load(tweetsPage, { xmlMode: true });
  console.timeEnd('tweetsPage and $tweets');

  const tweets = await Promise.all(
    $tweets('div.IlHKxe').map(async (i, t) => {
      // console.log('t.children: ', t.childNodes);
      // console.log("$tweets(t).find('time.ww6dff').attr('datetime'): ", $tweets(t).find('time.ww6dff').attr('datetime'));
      const tweetHref = $tweets(t).find('a.cihWJ').attr('href');
      console.log('tweetHref: ', tweetHref);
      const tweetId = tweetHref?.slice(-19, tweetHref.length);
      // console.log('tweetId: ', tweetId);
      const tweetDate = $tweets(t).find('div.eGzQsf time').attr('datetime');
      // console.log('tweetDate: ', tweetDate);
      return `${tweetId}/${tweetDate}`;
    })
  );
  const tweetsIds = tweets.join(',');
  console.log('🚀 ~ file: scrapeRelatedNews.tsx:44 ~ tweetsIds:', tweetsIds);

  // type sourceType = {
  //   id: number;
  //   name: string;
  //   url: string | null;
  //   scrapable: number | null;
  //   content_selector: string | null;
  // };

  const coveragePage = await fetch(`${related_coverage_url}&so=1`, { cache: 'no-cache' }).then((res) => res.text());
  const $coverage = cheerio.load(coveragePage, { xmlMode: true });

  const scrapedFromSource = 'https://news.google.com/';
  let currentSources: { name: string }[] = [];
  // let newSourcesFromDB: { id: number; name: string; url: string; scrapable: number; content_selector: string }[] = [];
  let updatedSourcesFromDB: sourceType[] = [];

  const updateCurrentSources = (
    allSources: {
      id: number;
      name: string;
      url: string | null;
      scrapable: number | null;
      content_selector: string | null;
    }[]
  ) => {
    console.log('[updateCurrentSources] allSources: ', allSources[0], ' - ', allSources.length);
    updatedSourcesFromDB = allSources;
    console.log(
      '[updateCurrentSources] updatedSourcesFromDB: ',
      updatedSourcesFromDB[0],
      ' - ',
      updatedSourcesFromDB.length
    );
  };

  // const getSourceId = (
  //   sourceName: string,
  //   allSources: {
  //     id: number;
  //     name: string;
  //     url: string | null;
  //     scrapable: number | null;
  //     content_selector: string | null;
  //   }[] | string
  // ) => {
  //   if(allSources?.id) {
  //     console.log('[getSourceId] allSources: ', allSources[0], ' - ', allSources.length);
  //     updatedSourcesFromDB = allSources;
  //   }
  //   console.log('[getSourceId] updatedSourcesFromDB: ', updatedSourcesFromDB[0], ' - ', updatedSourcesFromDB.length);
  //   const sourceId = allSources
  //     ? allSources.filter((s) => s.name === sourceName)
  //     : updatedSourcesFromDB.filter((s) => s.name === sourceName);
  //   console.log('[getSourceId] sourceId: ', sourceId);
  //   return sourceId[0].id || sourceName;
  // };

  const getSourceId = (sourceName: string) => {
    const source = updatedSourcesFromDB.filter((s) => s.name === sourceName);
    return source[0]?.id || sourceName;
  };

  const getSourceIdByName = (sourceName: string) => {
    const source = updatedSourcesFromDB.filter((s) => s.name.trim() === sourceName.trim());
    // console.log('[getSourceIdByName] sourceId: ', source);
    return source[0]?.id;
  };

  let newShortSlugs: string[] = [short_slug];

  const articles = await Promise.all(
    $coverage('div.NiLAwe')
      .filter((_, article) => {
        const hasImage = $coverage(article).find('img.tvs3Id.QwxBBf').length > 0;
        // const isSupportedSource = sources.some((s) => s.name === $coverage(article).find('.vr1PYe').text().trim());
        // this process sucks my soul out of my bones, f*ck it
        // remove this or just comment it out, and instead of ADDING sources manually, add all by default, and disable/remove/block manually bad enough resource
        // repeated false news or diry content or ideological wa*rfare against Egypt, remove immediately

        // make an array above, collect in it all the sources, all are accepted, then add all new sources to db with skipDuplicates: true
        // then I can have an updated list of sources, for reference, and for article since each article has a sourceId to it, I can get all articles from specific source or category.
        // return hasImage && isSupportedSource;

        // if hasImage is true, append to the sources array, when finished looping, in the .map(), in index === 0 only you can make a call to
        // add all those sources with skipDuplicates: true and get back their ids, and they'll be in the same order appeared/passed-to-map()
        // so you can use the returned array (the ids only arr created out of it) with the .map() index to match and add the sourceId of each article
        if (hasImage) {
          // console.log('hasImage true...');
          const articleSource = $coverage(article).find('.wEwyrc');
          currentSources.push({ name: articleSource.text() });
          // do the same with the short_slug(s)
          const new_short_slug = generateShortSlugs(1)[0];
          newShortSlugs.unshift(new_short_slug);
        }

        return hasImage;
      })
      .map(async (i, article) => {
        // console.log('inside .map()... newSources: ', newSources[0], ' - ', newSources.length);
        // add the index-th newSources[i] to each article

        // TODO: find a way to link, not only all these new article to the main article, but also, all of these articles to each other as related-coverage
        // since they don't have a related_coverage_url, they are the related-coverage of each other

        // (1: DONE)
        // make a call to related_coverage_url without the "&so=1" and scrape the tweets ids
        // save it to a const (related_coverage_tweets) as one string with commas,,,, to add it to all related articles including the main article!

        // (2)
        // make a call to the related_coverage_url with the "&so=1", scrape the top/recent 15/all
        // you will get their short_slug from the articles arr before saving to db, save the short_slug(s) to a const (related_coverage_articles)
        // as one string with commas,,,, to add it to all related articles including the main article!

        // (3)
        // THEN
        // 3-1 add the related_coverage_tweets arr to the related_coverage_tweets field
        // 3-2 add related_coverage_articles arr to the related_coverage_articles field to the articles in the articles arr, all have the same order
        // IGNORE: 3-3 add the newSources ids to each article in the articles arr, in the same order

        // (3) (IGNORE, I think)
        // make another call to each one (15 calls, or 1 createMany) to add all of their ids/short_slugs
        // (including themselves, for consistent timeline across all of them in the related-coverage section in the related section of each article)
        // in an array or a string with commas,,,, to the (related_coverage_articles) field

        // in all of these 10/15 articles so the tweets show up in the related section for all of them
        // const articleSource = $coverage(article).find('.wEwyrc')
        let allSources: sourceType[] = [];
        if (i === 0) {
          console.log('[i===0] currentSources[0]: ', currentSources[0]);
          console.time('allSource');
          allSources = await db.source.findMany({});
          console.log('allSources.length: ', allSources.length);
          console.timeEnd('allSource');

          const isNewSource = currentSources.filter((currentSource) => {
            return !allSources.some((allSource) => allSource.name === currentSource.name);
          });
          console.log('isNewSource.length: ', isNewSource.length);

          if (isNewSource.length) {
            console.time('currentSourceRes');
            const currentSourceRes = await db.source.createMany({
              data: currentSources,
              skipDuplicates: true
            });
            console.log('currentSourceRes: ', currentSourceRes);
            console.timeEnd('currentSourceRes');
            console.time('allSources');
            allSources = await db.source.findMany({});
            console.timeEnd('allSources');
          }

          console.log('[i===0] allSources.length: ', allSources.length);
          // console.log('🚀 ~ file: scrapeRelatedNews.tsx:170 ~ trulyNewSoruces ~ trulyNewSoruces:', trulyNewSoruces);
          // updatedSourcesFromDB = allSources;
          updateCurrentSources(allSources);
          // newSourcesFromDB = newSourceRes

          // check the newShortSlugs, if same count, use them with index to give each .map() article a new short_slug, then take them all as one ,,,, string to
          // the related_coverage_article string field
          // console.log('.map() inside i===0 newShortSlugs: ', newShortSlugs, ' - ', newShortSlugs.length);
        }

        // console.log('i: ', i, ' - updatedSourcesFromDB: ', updatedSourcesFromDB[0], ' - ', updatedSourcesFromDB.length);

        const sourceName = $coverage(article).find('a.wEwyrc').text().trim();
        // console.log('inside .map() sourceName: ', sourceName);
        const articleObj = {
          scraped_from: scrapedFromSource,
          title: sanitizeTitle($coverage(article).find('a.DY5T1d').text().trim()),
          google_thumb: $coverage(article).find('img.tvs3Id.QwxBBf').attr('src'),
          article_google_url: `${scrapedFromSource}${$coverage(article).find('a').attr('href')}`,
          slug: sanitizeSlug($coverage(article).find('a.DY5T1d').text().trim()),
          related_coverage_tweets: tweetsIds,
          published_at: $coverage(article).find('time.WW6dff').attr('datetime'),
          categoryId: categoryId,
          // short_slug: generateShortSlugs(1)[0],
          short_slug: newShortSlugs[i],
          related_coverage_article: newShortSlugs.join(','),
          sourceId: getSourceId(sourceName)
          // sourceId: getSourceId(sourceName, allSources ? allSources : "")
          // i === 0 && allSources
          //   ? allSources.filter((s) => s.name === $coverage(article).find('a.wEwyrc').text().trim())[0].id
          //   : getSourceId(sourceName)
          // : 'something is wrong'
          // ? updatedSourcesFromDB.filter((s) => s.name === $coverage(article).find('a.wEwyrc').text().trim())[0].id
          // related_coverage_article

          // leave the sourceId to be scraped and filtered against your (updated static) sources from db, since not all sources will be new
          // and when you save the newSources and get their ids, you can
          // 1- add each one to the empty/null sourceId articles in order, so any skipped ones will be in sync between here and in the prisma call
          // 2- the newSources, which are not existent in the (updated static) sources from db, add their name for the sourceId field,
          //    and filter the returned newSources response to get the id of the source with the same name!
          // 3- save all the newSources to db in the .filter() stage, call all sources (updated!) in the index===0 in the .map() stage
          //    and scrape the name, get it's id from the updated sources (just returned from db, in the .map())
        };
        return articleObj;
      })
      .get()
  );

  // createMany to save all new sources to db

  console.log('articles[1]: ', articles[1], ' - ', articles.length);
  // articles.map((a) => console.log('[articles] a.sourceId: ', a.sourceId));

  // console.log(
  //   'articles.map(a=> a.sourceId).sourceId: ',
  //   articles.map((a) => (a.sourceId = updatedSourcesFromDB))
  // );

  const coverageArticles = articles.map((a: any, i) => {
    // const sourceName: string = typeof a.sourceId === typeof '' ? a.sourceId;
    const sourceId = typeof a.sourceId === typeof '' ? getSourceIdByName(a.sourceId) : a.sourceId;
    // console.log('coverageArticles sourceId: ', sourceId);
    // if (i === 0) {
    //   console.log('in here ever?');
    //   return a;
    // } else {
    return { ...a, sourceId: sourceId };
    // }
  });

  // console.log('coverageArticles[1]: ', coverageArticles[1], ' - ', coverageArticles.length);
  console.log('before saving to db: coverageArticles[0]: ', coverageArticles[0], ' - ', coverageArticles.length);

  // coverageArticles.map((a) => console.log('[coverageArticles] a.sourceId: ', a.sourceId));

  // console.log('coverageArticles: ', coverageArticles);
  // console.log('newSources: ', newSources[0], ' - ', newSources.length);

  // console.log('[After] updatedSourcesFromDB: ', updatedSourcesFromDB[0], ' - ', updatedSourcesFromDB.length);
  // console.log('[After-2] updatedSourcesFromDB: ', updatedSourcesFromDB, ' - ', updatedSourcesFromDB.length);

  if (coverageArticles.length > 0) {
    const savedArticlesRes = await db.article.createMany({
      data: coverageArticles,
      skipDuplicates: true
    });
    console.log('savedArticlesRes: ', savedArticlesRes);

    // (DONE) remove the last 28 entries in the Article table, and do this again including the below
    // (DONE) update the main article with the related tweets and article short_slug(s), use the short_slug
    const updatedMainArticleRes = await db.article.update({
      where: { short_slug: short_slug },
      data: {
        related_coverage_tweets: tweetsIds,
        related_coverage_article: newShortSlugs.join(',')
      }
    });
    console.log('updatedMainArticleRes (the short_slug is): ', updatedMainArticleRes.short_slug);

    // and then don't scrape again if the related strings exist,
    // the tweets, if exists, just .map() with the Tweet component
    // the articles, just fetch them by one call, get all articles in the related_coverage_article string/arr, use the _in_ method of prisma (check docs)
  }
  // console.log('FAILED saving related_coverage_url, prisma error code: ', error.code, '\n', 'full error', error);

  console.timeEnd('relateCoverage get Route');
  return coverageArticles.length > 0 ? coverageArticles : [];
}

// YOu have a promblem yet to be solved, when you generate new short_slugs, let's say 30, and then you save to db with skipDuplicates it will ignore any
// duplicates and might save let's say 25 out of total of 30 new articles, that means that you have 5 articles with short_slug(s) already in your db
// those 5 will be included in the related articles timeline but they've no connection to this article (main or anyone of the new)

// THE SOLUTION:
// when you generate all the new short_slug(s), call the db and check if there's any duplicates, if there is, generate them again
// (you have the count this time, no need to re-do the scraping part, just the short_slug(s) generation part)
// and check again, when there are no duplicates, then this array of new short_slug(s) are ready to be used in the .map() section of the scrape
