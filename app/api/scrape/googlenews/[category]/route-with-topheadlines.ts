import { NextResponse, NextRequest } from 'next/server';
import * as cheerio from 'cheerio';
import { db } from '@/lib/db';
import { sanitizeTitle } from '@/utils/sanitizeTitle';
import { sanitizeSlug } from '@/utils/sanitizeSlug';
import { categoriesAndSources } from '@/data/static/staticCategoriesAndSources';
import generateShortSlugs from '@/utils/generateShortSlugs';
import SaveArticles from '@/utils/saveArticles';
import updateLastDate from '@/utils/updateLastDate';
import { sourceType } from '@/types';
// const util = require('util');

export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest, params: { params: { category: string } }) {
  console.time('[Time] GET Route');
  const { category } = params.params;
  const currentCategory = categoriesAndSources.find((c) => c.name === category);
  if (!currentCategory) {
    return new NextResponse('UnSupported Category. If new, add it locally/statically', { status: 415 });
  }

  // use something like this to get the top_headline: true AND categoryId:1 to get the top_headlines news of a specific category
  // .findUnique({ where: { id: currentCategory.id, AND: { name: 'egypt' } }, select: { last_date: true } })
  // when you want to get all the top headline news, you will need to get all the articles with top_headline true
  // when you want to get all the top headline news of a specific category, you will need to get all the articles with top_headline: true AND categoryId: 1
  // when you want to get all top headline news of the "top-headline" category (not specific for any other category), you will need to get all the articles with: categoryId: 1

  // the logic:
  // scrape top headline news from google news
  // after you've the articles arr BUT before saving to db, check all of them, by slug and published_at date with prisma&db-call, 
  // if (any is true) the article doesn't exist, then, add it as a new article with top_headline: true and categoryId: top-headline.id
  // if (false) the article already exists (under a diff category), then, update the top_headline field to true 

  const last_date = await db.category
    .findUnique({ where: { id: currentCategory.id }, select: { last_date: true } })
    .then((l: any) => l?.last_date);

  const page = await fetch(currentCategory.google_news_url).then((res) => res.text());
  const $ = cheerio.load(page, { xmlMode: true });

  const sources = currentCategory.source;
  const scrapedFromSource = 'https://news.google.com/';
  let newLastDate = last_date ? new Date(last_date) : null;
  console.log('[Before] last_date: ', last_date);

  let coverage_url = '';
  let coverage_url_arr: string[] = [];
  let currentSources: { name: string }[] = [];
  let updatedSourcesFromDB: sourceType[] = [];

  const updateCurrentSources = (allSources: sourceType[]) => {
    console.log('[updateCurrentSources] allSources: ', allSources[0], ' - ', allSources.length);
    updatedSourcesFromDB = allSources;
    console.log(
      '[updateCurrentSources] updatedSourcesFromDB: ',
      updatedSourcesFromDB[0],
      ' - ',
      updatedSourcesFromDB.length
    );
  };

  const getSourceId = (sourceName: string) => {
    const source = updatedSourcesFromDB.filter((s) => s.name === sourceName);
    return source[0]?.id || sourceName;
  };

  const articles = await Promise.all(
    $('article.IBr9hb, article.IFHyqb.DeXSAc')
      .filter((_, article) => {
        const hasImage = $(article).find('img.Quavad').length > 0;
        // Delete/Filter-Out specific sources manually when caught manually, for now, accept all sources,
        // const isSupportedSource = sources.some((s) => s.name === $(article).find('.vr1PYe').text().trim());
        const articleDatetime = $(article).find('time.hvbAAd').attr('datetime');
        if (articleDatetime && last_date) {
          const isRecent = new Date(articleDatetime) > new Date(last_date);
          const isNewLastDate = newLastDate ? new Date(articleDatetime) > newLastDate : false;
          if (isNewLastDate) {
            newLastDate = new Date(articleDatetime);
          }
          if (hasImage && isRecent && article.next) {
            coverage_url = $(article.next).children('.Ylktk').children('.jKHa4e').attr('href')?.toString() || '';
            coverage_url_arr.push(coverage_url);

            const articleSource = $(article).find('.vr1PYe').text().trim();
            currentSources.push({ name: articleSource });
          }
          return hasImage && isRecent;
        }
        return false;
      })
      .map(async (i, article) => {
        let allSources: sourceType[] = [];
        if (i === 0) {
          console.log('[i===0] currentSources[0]: ', currentSources[0]);
          const currentSourceRes = await db.source.createMany({
            data: currentSources,
            skipDuplicates: true
          });
          console.log('[i===0] currentSourceRes: ', currentSourceRes);
          // if there was any new sources that prisma just saved to the db, then fetch all (updated) sources
          // get allSources from db, since I don't have them anyway, whether prisma just added new sources to them or not
          allSources = await db.source.findMany();
          console.log('[i===0] allSources.length: ', allSources.length);
          updateCurrentSources(allSources);
        }

        const sourceName = $(article).find('.vr1PYe').text().trim();
        const articleObj = {
          scraped_from: scrapedFromSource,
          title: sanitizeTitle($(article).find('h4').text().trim()),
          google_thumb: $(article).find('img.Quavad').attr('src'),
          article_google_url: `${scrapedFromSource}${$(article).find('a').attr('href')}`,
          related_coverage_url: coverage_url_arr[i] ? `${scrapedFromSource}${coverage_url_arr[i]}` : '',
          slug: sanitizeSlug($(article).find('h4').text().trim()),
          published_at: $(article).find('time.hvbAAd').attr('datetime'),
          // sourceId: sources.filter((s) => s.name === $(article).find('.vr1PYe').text().trim())[0].id,
          sourceId: getSourceId(sourceName),
          categoryId: currentCategory.id,
          short_slug: generateShortSlugs(1)[0],
          top_headline: currentCategory.id === 8 ? true : false
        };
        return articleObj;
      })
      .get()
  );

  console.log('[After] newLastDate: ', newLastDate);
  console.log('coverage_url_arr: ', coverage_url_arr, ' - ', coverage_url_arr.length);

  articles.map((a) => console.log('a.sourceId: ', a.sourceId));


  // call with prisma, are there any article with any of these slugs or any of these published_at dates?
  // if yes, return them to me, then loop over them and update their top_headline field to true 
  // if no, or all the rest if some was yes, loop and save to the db as new articles with top_headline field true and categoryId: top-headline.id  


  // check that there are new articles, and newLastDate has the updated last_date
  // if (newLastDate && last_date && newLastDate > new Date(last_date) && articles.length > 0) {
  //   console.log('Adding new article to DB...');
  //   // save new articles to db
  //   const isSaved = await SaveArticles(articles);
  //   if (isSaved) {
  //     console.log('Updating last_date to DB...');
  //     // on success, update last_date
  //     const res = await updateLastDate({ newLastDate, currentCategory });
  //     if (res && res.last_date) {
  //       console.log('Updated last_date on db, res: ', res.last_date);
  //     }
  //   }
  // }

  console.timeEnd('[Time] GET Route');
  return NextResponse.json({
    status: 200,
    last_date: last_date,
    newLastDate: newLastDate,
    articles: articles
  });
}
