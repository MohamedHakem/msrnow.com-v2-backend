import { NextResponse, NextRequest } from 'next/server';
import * as cheerio from 'cheerio';
import { db } from '@/lib/db';
// import { Redis } from '@upstash/redis';
// const redis = Redis.fromEnv();
// export const runtime = 'edge';
export const fetchCache = 'force-no-store';

export async function GET() {
  console.time('[End] GET Route');
  const urls = [
    categoriesAndSources[0].google_news_url,
    categoriesAndSources[1].google_news_url,
    categoriesAndSources[2].google_news_url,
    categoriesAndSources[3].google_news_url,
    categoriesAndSources[4].google_news_url,
    categoriesAndSources[5].google_news_url,
    categoriesAndSources[6].google_news_url
  ];

  console.log('START Fetching...');
  console.time('Fetching');
  console.time('[1] promises');
  const promises = urls.map(async (url) => {
    try {
      const data = await fetch(url).then((res) => res.text());
      return { url, data };
    } catch (error) {
      console.log('error while fetching: ', error);
      return { url, error };
    }
  });
  const settledResults = await Promise.allSettled(promises);
  console.timeEnd('[1] promises');

  console.time('[2] fetchDataArray');
  const fetchDataArray = settledResults.map((result, i) => {
    if (result.status === 'fulfilled') {
      const category = categoriesAndSources.filter((c) => c.google_news_url === result.value.url)[0];
      if (category) return { category: category?.name, data: result.value.data?.slice(0, 50) };
      return null;
    } else if (result.status === 'rejected') {
      console.error(`Failed to fetch data from ${result.reason.url}: ${result.reason.error}`);
      return null;
    }
  });
  // .filter((d) => d !== null && d !== undefined);
  console.log('fetchDataArray: ', fetchDataArray);
  console.timeEnd('[2] fetchDataArray');

  console.log('END Fetching...');
  console.timeEnd('Fetching');

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  // START of testing new way area
  console.log('\n\nNEW WAY:\n');
  console.time('Processing');
  console.log('START Processing');

  const currentCategory = categoriesAndSources[0];

  console.time('last_date');
  const last_date = await db.category
    .findFirst({ where: { name: currentCategory.name }, select: { last_date: true } })
    .then((l) => l?.last_date);
  console.timeEnd('last_date');

  console.time('page');
  const page = await fetch(currentCategory.google_news_url).then((res) => res.text());
  console.timeEnd('page');

  console.time('cheerio');
  const $ = cheerio.load(page, { xmlMode: true });
  console.timeEnd('cheerio');

  const sources = currentCategory.source;
  const scrapedFromSource = 'https://news.google.com/';

  console.time('articles');
  const articles = await Promise.all(
    $('article.IBr9hb, article.IFHyqb.DeXSAc')
      .filter((_, article) => {
        const hasImage = $(article).find('img.Quavad').length > 0;
        const isSupportedSource = sources.some((s) => s.name === $(article).find('.vr1PYe').text().trim());
        const articleDatetime = $(article).find('time.hvbAAd').attr('datetime');
        const isRecent = articleDatetime && last_date ? new Date(articleDatetime) > new Date(last_date) : false;

        return hasImage && isSupportedSource && isRecent;
      })
      .map(async (i, article) => {
        const articleObj = {
          scraped_from: scrapedFromSource,
          title: sanitizeTitle($(article).find('h4').text().trim()),
          google_thumb: $(article).find('img.Quavad').attr('src'),
          article_google_url: `${scrapedFromSource}${$(article).find('a').attr('href')}`,
          slug: sanitizeSlug($(article).find('h4').text().trim()),
          published_at: $(article).find('time.hvbAAd').attr('datetime'),
          sourceId: sources.filter((s) => s.name === $(article).find('.vr1PYe').text().trim())[0].id,
          categoryId: currentCategory.id
        };
        return articleObj;
      })
      .get()
  );
  console.timeEnd('articles');

  // console.time('articlesResults');
  // const articlesResults = await Promise.all(articlesPromises);
  // console.timeEnd('articlesResults');

  // console.time('filtering');
  // const articles = articlesResults.filter((result) => result.status === 'fulfilled').map((r) => r.value);
  // console.timeEnd('filtering');

  console.log('END Processing');
  console.timeEnd('Processing');
  // END of testing new way area

  console.timeEnd('[End] GET Route');
  return NextResponse.json({ status: 200, articles });
}

// helper functions
const sanitizeTitle = (title: string) => {
  return title.replace(/\b\w+\.(com|net|org|co|uk)\b/gi, '');
};

const sanitizeSlug = (title: string) => {
  // Remove domain names from the title
  const noDomainTitle = title.replace(/\b\w+\.(com|net|org|co|uk)\b/gi, '');
  // Replace illegal characters with hyphens
  const sanitizedTitle = noDomainTitle.replace(/[\\?%*:|"<>،]/g, '-');
  // Replace spaces, trailing periods, and starting/trailing hyphens with a single hyphen
  const cleanedTitle = sanitizedTitle.replace(/[\s.]+/g, '-').replace(/^-+|-+$/g, '');
  // Remove any "?" char, "..", "«", "»", and "!"
  const finalTitle = cleanedTitle.replace(/[\?«»!]+/g, '');
  return finalTitle;
};

const categoriesAndSources = [
  {
    id: 1,
    name: 'egypt',
    google_news_url:
      'https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNREpyTlRRU0FtRnlLQUFQAQ?hl=ar&gl=EG&ceid=EG%3Aar',
    source: [
      {
        id: 1,
        name: 'اليوم السابع',
        url: null,
        scrapable: 1,
        content_selector: '#articleBody'
      },
      {
        id: 2,
        name: 'Masrawy - مصراوي',
        url: null,
        scrapable: 1,
        content_selector: 'div.ArticleDetails.details'
      },
      {
        id: 3,
        name: 'Sky News Arabia سكاي نيوز عربية',
        url: null,
        scrapable: 1,
        content_selector:
          'div.article-body > :not(.AV631f7bfbd3ba2709b86929c7):not(.ng-isolate-scope):not(.mceNonEditable):not(.dfp-inread-article):not(.article-bottom-share-cont):not(.article-tags)'
      },
      {
        id: 4,
        name: 'العربية',
        url: null,
        scrapable: 1,
        content_selector: '#body-text > *:not(.advertisement-wrapper):not(.feed-card.ar)'
      },
      {
        id: 5,
        name: 'Al Masry Al Youm - المصري اليوم',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 6,
        name: 'Sada El-Bald صدى البلد',
        url: null,
        scrapable: 0,
        content_selector: null
      }
    ]
  },
  {
    id: 2,
    name: 'sports',
    google_news_url:
      'https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtRnlHZ0pGUnlnQVAB?hl=ar&gl=EG&ceid=EG%3Aar',
    source: [
      {
        id: 1,
        name: 'اليوم السابع',
        url: null,
        scrapable: 1,
        content_selector: '#articleBody'
      },
      {
        id: 2,
        name: 'Masrawy - مصراوي',
        url: null,
        scrapable: 1,
        content_selector: 'div.ArticleDetails.details'
      },
      {
        id: 3,
        name: 'Sky News Arabia سكاي نيوز عربية',
        url: null,
        scrapable: 1,
        content_selector:
          'div.article-body > :not(.AV631f7bfbd3ba2709b86929c7):not(.ng-isolate-scope):not(.mceNonEditable):not(.dfp-inread-article):not(.article-bottom-share-cont):not(.article-tags)'
      },
      {
        id: 4,
        name: 'العربية',
        url: null,
        scrapable: 1,
        content_selector: '#body-text > *:not(.advertisement-wrapper):not(.feed-card.ar)'
      },
      {
        id: 5,
        name: 'Al Masry Al Youm - المصري اليوم',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 6,
        name: 'Sada El-Bald صدى البلد',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 7,
        name: 'Yallakora - يلاكورة',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 8,
        name: 'FilGoal.com',
        url: null,
        scrapable: 0,
        content_selector: null
      }
    ]
  },
  {
    id: 3,
    name: 'world',
    google_news_url:
      'https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtRnlHZ0pGUnlnQVAB?hl=ar&gl=EG&ceid=EG%3Aar',
    source: [
      {
        id: 1,
        name: 'اليوم السابع',
        url: null,
        scrapable: 1,
        content_selector: '#articleBody'
      },
      {
        id: 2,
        name: 'Masrawy - مصراوي',
        url: null,
        scrapable: 1,
        content_selector: 'div.ArticleDetails.details'
      },
      {
        id: 3,
        name: 'Sky News Arabia سكاي نيوز عربية',
        url: null,
        scrapable: 1,
        content_selector:
          'div.article-body > :not(.AV631f7bfbd3ba2709b86929c7):not(.ng-isolate-scope):not(.mceNonEditable):not(.dfp-inread-article):not(.article-bottom-share-cont):not(.article-tags)'
      },
      {
        id: 4,
        name: 'العربية',
        url: null,
        scrapable: 1,
        content_selector: '#body-text > *:not(.advertisement-wrapper):not(.feed-card.ar)'
      },
      {
        id: 5,
        name: 'Al Masry Al Youm - المصري اليوم',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 9,
        name: 'BBC Arabic',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 10,
        name: 'CNN Arabic',
        url: null,
        scrapable: 0,
        content_selector: null
      }
    ]
  },
  {
    id: 4,
    name: 'local',
    google_news_url:
      'https://news.google.com/topics/CAAqHAgKIhZDQklTQ2pvSWJHOWpZV3hmZGpJb0FBUAE/sections/CAQiU0NCSVNPRG9JYkc5allXeGZkakpDRUd4dlkyRnNYM1l5WDNObFkzUnBiMjV5REJJS0wyMHZNRE5vTTNFMlpub01DZ292YlM4d00yZ3pjVFptS0FBKjIIACouCAoiKENCSVNHRG9JYkc5allXeGZkako2REFvS0wyMHZNRE5vTTNFMlppZ0FQAVAB?hl=ar&gl=EG&ceid=EG%3Aar',
    source: [
      {
        id: 1,
        name: 'اليوم السابع',
        url: null,
        scrapable: 1,
        content_selector: '#articleBody'
      },
      {
        id: 2,
        name: 'Masrawy - مصراوي',
        url: null,
        scrapable: 1,
        content_selector: 'div.ArticleDetails.details'
      },
      {
        id: 5,
        name: 'Al Masry Al Youm - المصري اليوم',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 6,
        name: 'Sada El-Bald صدى البلد',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 12,
        name: 'القاهرة 24',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 13,
        name: 'الأسبوع',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 14,
        name: 'بوابة أخبار اليوم',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 15,
        name: 'الوطن',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 16,
        name: 'جريدة الدستور',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 17,
        name: 'البوابة نيوز',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 18,
        name: 'بوابة الأهرام',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 19,
        name: 'جريدة النهار المصرية',
        url: null,
        scrapable: 0,
        content_selector: null
      }
    ]
  },
  {
    id: 5,
    name: 'politics',
    google_news_url:
      'https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRFZ4ZERBU0FtRnlLQUFQAQ?hl=ar&gl=EG&ceid=EG%3Aar',
    source: [
      {
        id: 3,
        name: 'Sky News Arabia سكاي نيوز عربية',
        url: null,
        scrapable: 1,
        content_selector:
          'div.article-body > :not(.AV631f7bfbd3ba2709b86929c7):not(.ng-isolate-scope):not(.mceNonEditable):not(.dfp-inread-article):not(.article-bottom-share-cont):not(.article-tags)'
      },
      {
        id: 4,
        name: 'العربية',
        url: null,
        scrapable: 1,
        content_selector: '#body-text > *:not(.advertisement-wrapper):not(.feed-card.ar)'
      },
      {
        id: 5,
        name: 'Al Masry Al Youm - المصري اليوم',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 9,
        name: 'BBC Arabic',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 10,
        name: 'CNN Arabic',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 11,
        name: 'الحرة',
        url: null,
        scrapable: 0,
        content_selector: null
      }
    ]
  },
  {
    id: 6,
    name: 'finance',
    google_news_url:
      'https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtRnlHZ0pGUnlnQVAB?hl=ar&gl=EG&ceid=EG%3Aar',
    source: [
      {
        id: 1,
        name: 'اليوم السابع',
        url: null,
        scrapable: 1,
        content_selector: '#articleBody'
      },
      {
        id: 2,
        name: 'Masrawy - مصراوي',
        url: null,
        scrapable: 1,
        content_selector: 'div.ArticleDetails.details'
      },
      {
        id: 4,
        name: 'العربية',
        url: null,
        scrapable: 1,
        content_selector: '#body-text > *:not(.advertisement-wrapper):not(.feed-card.ar)'
      },
      {
        id: 5,
        name: 'Al Masry Al Youm - المصري اليوم',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 6,
        name: 'Sada El-Bald صدى البلد',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 7,
        name: 'Yallakora - يلاكورة',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 13,
        name: 'الأسبوع',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 15,
        name: 'الوطن',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 20,
        name: 'السعودية Investing.com',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 21,
        name: 'Alborsa News  جريدة البورصة',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 22,
        name: 'جريدة المال',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 23,
        name: 'مُباشِر',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 24,
        name: 'أموال الغد',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 25,
        name: 'اقتصاد الشرق مع Bloomberg',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 26,
        name: 'صحيفة الشرق الأوسط',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 27,
        name: 'المتداول العربي',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 28,
        name: 'شبكة رصد',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 29,
        name: 'نجوم مصرية',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 30,
        name: 'محتوي بلس',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 31,
        name: 'ديلي فوركس',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 32,
        name: 'news.elbadil.com',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 33,
        name: 'news.elganna.com',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 34,
        name: 'المساء سبورت',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 35,
        name: 'news.5lejnews.com',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 36,
        name: 'Hespress هسبريس',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 37,
        name: 'بوابة النيل الإخباري',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 38,
        name: 'ثقفني',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 39,
        name: 'أخبار الآن',
        url: null,
        scrapable: 0,
        content_selector: null
      }
    ]
  },
  {
    id: 7,
    name: 'arts',
    google_news_url:
      'https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtRnlHZ0pGUnlnQVAB?hl=ar&gl=EG&ceid=EG%3Aar',
    source: [
      {
        id: 1,
        name: 'اليوم السابع',
        url: null,
        scrapable: 1,
        content_selector: '#articleBody'
      },
      {
        id: 2,
        name: 'Masrawy - مصراوي',
        url: null,
        scrapable: 1,
        content_selector: 'div.ArticleDetails.details'
      },
      {
        id: 3,
        name: 'Sky News Arabia سكاي نيوز عربية',
        url: null,
        scrapable: 1,
        content_selector:
          'div.article-body > :not(.AV631f7bfbd3ba2709b86929c7):not(.ng-isolate-scope):not(.mceNonEditable):not(.dfp-inread-article):not(.article-bottom-share-cont):not(.article-tags)'
      },
      {
        id: 4,
        name: 'العربية',
        url: null,
        scrapable: 1,
        content_selector: '#body-text > *:not(.advertisement-wrapper):not(.feed-card.ar)'
      },
      {
        id: 5,
        name: 'Al Masry Al Youm - المصري اليوم',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 6,
        name: 'Sada El-Bald صدى البلد',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 9,
        name: 'BBC Arabic',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 13,
        name: 'الأسبوع',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 15,
        name: 'الوطن',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 16,
        name: 'جريدة الدستور',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 26,
        name: 'صحيفة الشرق الأوسط',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 29,
        name: 'نجوم مصرية',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 30,
        name: 'محتوي بلس',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 33,
        name: 'news.elganna.com',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 34,
        name: 'المساء سبورت',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 39,
        name: 'أخبار الآن',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 40,
        name: 'ETبالعربي | ETbilarabi',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 41,
        name: 'MCD / مونت كارلو الدولية',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 42,
        name: 'لها',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 43,
        name: 'FilFan.com',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 44,
        name: 'عرب فايف',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 45,
        name: 'جريدة البشاير',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 46,
        name: 'الفجر',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 47,
        name: 'Lebanon24',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 48,
        name: 'هن - Honna',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 49,
        name: 'موقع شبابيك',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 50,
        name: 'الخليج 365',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 51,
        name: 'الخليج 24',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 52,
        name: 'الجرس',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 53,
        name: 'دنيا الوطن',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 54,
        name: 'قناة الجديد',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 55,
        name: 'النهار',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 56,
        name: 'مجلة سيدتي',
        url: null,
        scrapable: 0,
        content_selector: null
      },
      {
        id: 57,
        name: 'Elfann.com',
        url: null,
        scrapable: 0,
        content_selector: null
      }
    ]
  }
];

// const articles = articlesResults
//   .filter((result): result is PromiseSettledResult<any> => result.status === 'fulfilled')
//   .map((a) => a.value);

// console.log(`Fetched data from ${category[0] ? category[0].name : result.value.url}`);
// console.log(`  (${i}) FilFilled: `, 'url: ', result.value.url, '\n', '  data: ', result.value.data?.slice(0, 80));
// console.log('Rejected: ', ' \n ', ' url: ', result.reason);
