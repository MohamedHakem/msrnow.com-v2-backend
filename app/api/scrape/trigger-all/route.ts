import { db } from '@/lib/db';

export async function HEAD(request: Request) {
  console.time('[trigger-all] HEAD');

  // Get all categories from db.
  console.time('db.category.findMany');
  const categories = await db.category.findMany({
    where: {
      NOT: {
        name: 'top-headline'
      }
    },
    select: {
      name: true
    }
  });
  console.timeEnd('db.category.findMany');
  console.log('🚀 ~ file: route.ts:15 ~ HEAD ~ categories:', categories);

  // Generate API endpoints
  let endpoints = categories.map((category) => `https://msnewsapi.vercel.app/api/scrape/googlenews/${category.name}`);
  console.log('🚀 ~ file: route.ts:20 ~ endpoints ~ endpoints:', endpoints);

  // add the (a bit different) category
  endpoints.push('https://msnewsapi.vercel.app/api/scrape/googlenewstopheadlines');

  // Fetch each endpoint and check the response status.
  console.time('Promise.allSettled');
  const results = await Promise.allSettled(
    endpoints.map(async (endpoint) => {
      const response = await fetch(endpoint);
      return {
        endpoint,
        status: response.status
      };
    })
  );
  console.timeEnd('Promise.allSettled');
  console.log('🚀 ~ file: route.ts:35 ~ GET ~ results:', results);

  // Return a response with the results of the checks.
  console.timeEnd('[trigger-all] HEAD');
  return new Response(JSON.stringify(results), { status: 200 });
}
