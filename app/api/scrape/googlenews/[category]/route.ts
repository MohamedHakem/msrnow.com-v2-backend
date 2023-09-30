import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { db } from '@/lib/db';
import { sanitizeTitle } from '@/utils/sanitizeTitle';
import { sanitizeSlug } from '@/utils/sanitizeSlug';
import { categoriesAndSources } from '@/data/static/staticCategoriesAndSources';
import generateShortSlugs from '@/utils/generateShortSlugs';
import SaveArticles from '@/utils/saveArticles';
import updateLastDate from '@/utils/updateLastDate';
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
          if (hasImage && isSupportedSource && isRecent && article.next) {
            coverage_url = $(article.next).children('.Ylktk').children('.jKHa4e').attr('href')?.toString() || '';
            coverage_url_arr.push(coverage_url);
          }
          return hasImage && isSupportedSource && isRecent;
        }
        return false;
      })
      .map(async (i, article) => {
        const articleObj = {
          scraped_from: scrapedFromSource,
          title: sanitizeTitle($(article).find('h4').text().trim()),
          google_thumb: $(article).find('img.Quavad').attr('src'),
          article_google_url: `${scrapedFromSource}${$(article).find('a').attr('href')}`,
          related_coverage_url: coverage_url_arr[i] ? `${scrapedFromSource}${coverage_url_arr[i]}` : '',
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

  console.log('[After] newLastDate: ', newLastDate);
  console.log('coverage_url_arr: ', coverage_url_arr, ' - ', coverage_url_arr.length);

  // check that there are new articles, and newLastDate has the updated last_date
  if (newLastDate && last_date && newLastDate > new Date(last_date) && articles.length > 0) {
    // save new articles to db
    console.log('Adding new article to DB...');
    const isSaved = await SaveArticles(articles);
    if (isSaved) {
      // on success, update last_date
      console.log('Updating last_date to DB...');
      const res = await updateLastDate({ newLastDate, currentCategory });
      if (res && res.last_date) {
        console.log('Updated last_date on db, res: ', res.last_date);
      }
    }
  }

  console.timeEnd('[Time] GET Route');
  return NextResponse.json({
    status: 200,
    last_date: last_date,
    newLastDate: newLastDate,
    articles: articles
  });
}
