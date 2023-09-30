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
  const endpoints = categories.map((category) => `https://msnewsapi.vercel.app/api/scrape/googlenews/${category.name}`);
  console.log('🚀 ~ file: route.ts:20 ~ endpoints ~ endpoints:', endpoints);

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

  // Handle the outcome of each request.
  // for (const result of results) {
  //   if (result.status === 'fulfilled') {
  //     // The request was resolved.
  //     // TODO: Do something with the resolved value, log it to the console.
  //   } else {
  //     // The request was rejected.
  //     // TODO: Do something with the resolved value, log it to the console.
  //   }
  // }

  // Return a response with the results of the checks.
  console.timeEnd('[trigger-all] HEAD');
  return new Response(JSON.stringify(results), { status: 200 });
}
