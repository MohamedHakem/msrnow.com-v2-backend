import { NextResponse, NextRequest } from 'next/server';
import * as cheerio from 'cheerio';
import { db } from '@/lib/db';
import { sanitizeTitle } from '@/utils/sanitizeTitle';
import { sanitizeSlug } from '@/utils/sanitizeSlug';
import { categoriesAndSources } from '@/data/static/staticCategoriesAndSources';
import generateShortSlugs from '@/utils/generateShortSlugs';
import SaveArticles from '@/utils/saveArticles';
import updateLastDate from '@/utils/updateLastDate';
// import { Redis } from '@upstash/redis';
// const redis = Redis.fromEnv();

export const runtime = 'nodejs'; // general scrape. Edge for on-the-fly article-content scraping

// the edge is useful for scraping articles from source, and for scraping coverage news
// but for scraping main news, it's not useful, because it's not a static page, it's a dynamic page that loads more articles when you scroll down
// so we need to use a cron job to scrape it every 5 minutes or so, and save it to db
// and then we use the edge to serve the data from db, and to scrape articles from source when requested
// so we need to make 2 cron jobs, one for scraping main news, and one for scraping articles from source
// and we need to make 2 routes, one for serving main news from db, and one for serving articles from source
// and we need to make 2 routes, one for scraping main news, and one for scraping articles from source

// all the above were auto from copied code, now we need to edit it to fit our needs

// what I have in mind is, the edge is useful but it's a limited resource, so we use it for scraping articles from source
// to show the 1st time visitor the article's content, and we use it for scraping coverage news
// but for the 5min cron job, we use a cron job to scrape the main news, and save it to db on a node.js route that's not on the edge since it's not critical

// export const runtime = 'edge';
// There's an error if I uncomment above line, but I don't know what it does. uncomment, check the console to debug.

export const fetchCache = 'force-no-store'; // this is to force the edge to fetch the page from the source, not from the cache

export async function GET(request: NextRequest, params: { params: { category: string } }) {
  console.time('GET Route');
  const { category } = params.params;
  const currentCategory = categoriesAndSources.find((c) => c.name === category);
  if (!currentCategory) {
    return new NextResponse('UnSupported Category', { status: 415 });
  }

  console.time('db');
  const last_date = await db.category
    .findUnique({ where: { id: currentCategory.id }, select: { last_date: true } })
    .then((l) => l?.last_date);

  // use this while testing to add an example last_date
  // if (last_date === '2023-09-10T08:21:51.000Z') {
  //   const res = await db.category.update({
  //     where: { id: currentCategory.id },
  //     data: { last_date: '2023-09-08T14:49:14.000Z' }
  //   });
  //   console.log('top res: ', res);
  // }

  // good enough, make a dates table, call it model Dates with fields like id, google_egypt_news_article_last_date, category_id,
  // or just add a new field on the category table called Last_date and it's a simple string probably, no need to mess around with Date type
  // use that for each category and that's it
  // Also, every thing different is a new category, subcategories are categories to simplify this process and avoid creating other tables
  // console.log('random: ', random);

  console.timeEnd('db');
  console.time('fetch');
  const page = await fetch(currentCategory.google_news_url).then((res) => res.text());
  console.timeEnd('fetch');

  console.time('load');
  const $ = cheerio.load(page, { xmlMode: true });
  console.timeEnd('load');
  // const categoriesWithSources = await db.category.findMany({ include: { source: true } });

  const sources = currentCategory.source;
  const scrapedFromSource = 'https://news.google.com/';
  let newLastDate = last_date ? new Date(last_date) : null;
  console.log('[Before] newLastDate: ', newLastDate);

  console.time('articles');
  const articles = await Promise.all(
    $('article.IBr9hb, article.IFHyqb.DeXSAc')
      .filter((_, article) => {
        const hasImage = $(article).find('img.Quavad').length > 0;
        const isSupportedSource = sources.some((s) => s.name === $(article).find('.vr1PYe').text().trim());
        const articleDatetime = $(article).find('time.hvbAAd').attr('datetime');
        if (articleDatetime && last_date) {
          const isRecent = new Date(articleDatetime) > new Date(last_date);
          const isNewLastDate = newLastDate ? new Date(articleDatetime) > newLastDate : false;
          if (isNewLastDate) {
            newLastDate = new Date(articleDatetime);
          }
          return hasImage && isSupportedSource && isRecent;
        }
        return false;
      })
      .map(async (_, article) => {
        const articleObj = {
          scraped_from: scrapedFromSource,
          title: sanitizeTitle($(article).find('h4').text().trim()),
          google_thumb: $(article).find('img.Quavad').attr('src'),
          article_google_url: `${scrapedFromSource}${$(article).find('a').attr('href')}`,
          slug: sanitizeSlug($(article).find('h4').text().trim()),
          published_at: $(article).find('time.hvbAAd').attr('datetime'),
          sourceId: sources.filter((s) => s.name === $(article).find('.vr1PYe').text().trim())[0].id,
          categoryId: currentCategory.id,
          short_slug: generateShortSlugs(1)[0]
        };
        return articleObj;
      })
      .get()
  );
  console.timeEnd('articles');
  console.log('[After] newLastDate: ', newLastDate);

  // check that there are new articles, and newLastDate has the updated last_date
  if (newLastDate && last_date && newLastDate > new Date(last_date) && articles.length > 0) {
    // save new articles to db
    console.log('Adding new article to DB...');
    console.time('isSaved');
    const isSaved = await SaveArticles(articles);
    console.timeEnd('isSaved');
    if (isSaved) {
      // on success, update last_date
      console.log('Updating last_date to DB...');
      console.time('updateLastDate');
      const res = await updateLastDate({ newLastDate, currentCategory });
      console.timeEnd('updateLastDate');
      if (res && res.last_date) {
        console.log('Updated last_date on db, res: ', res.last_date);
      }
    }
  }

  console.timeEnd('GET Route');
  return NextResponse.json({ status: 200, last_date: last_date, newLastDate: newLastDate, articles: articles });
}

// 1- dynamically call this api, for each Google-News category/subcategory
// will make a cronitor or GitHub cron job

// console.time('titleTags');
//   const titleTags = $('.WwrzSb');
// console.timeEnd('titleTags');

// const titles = [];
// for (const titleTag of titleTags) {
//   // console.log("titleTag: ", titleTag)

//   const title = titleTag;
//   titles.push(title);
// }

// console.log('titleTags: ', titleTags);

// console.log('page: ', page);

// how to parse this into a real html? do I have to use cheerio? or is there a better way?
// can you tell me how to measure the performance of this route? I want to know how much time it takes to run, and how much memory it uses

// 4- extract articles based on classes, filter them based on date (our lastDate could be on GitHub or in vercel KV or our db to check against it)
// 5- add to db in one call, as a batch or prisma createMany or smthing

// return NextResponse.json({ status: 200, data: titles });

// return new NextResponse('hello from route', {
//   status: 200,
//   statusText: 'saved to db successfully'
// }); // if there's any error, say "saved to db with some errors"

/*

1- dynamically call this api, for each Google-News category/subcategory
2- verify that it's supported, if not respond to handle it accordingly 
3- use axios/fetch to get the page and cheerio to parse it
4- extract articles based on classes, filter them based on date
5- add to db in one call, as a batch or prisma createMany or smthing

note that:
- you have 4 scrape process
1- scrape main news (this is the first and main one)
2- scrape source url (test and see where to put this, with/after #1 or before #2)
3- scrape article content from source (this happens when article is requested, we display static from db data while fetching the article body from source)
4- scrape coverage news ()
*/

// ONE API for all categories/sub
// ONE API for all single news article content (+browserless for almasryalyoum)
// ONE API for all coverage (of any single news article)
// remember https://aawsat.com/ and vercel.com articles designs are top notch along with alarabyia and another site

// call each API category with cron job on GitHub
// or call the main API and it by itself calls all the API categories every 5 mins (by cronitor if you like)

////
// you either
// 1- remove and dumb the prod branch, then migrate to a new branch then promote it to prod
// 2- make a new account/workspace in PlanetScale, use it for all the new [write], and [reads], and single-article retrival could be tried on both dbs, the new then the old
// 3- make the vercel project region is the same as the current planetscale db region
// in all cases, make the region of vercel and planetscale the same, either all in us, or all in frankfurt
