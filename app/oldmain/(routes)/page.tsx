// import ViewCounter from '@/components/view-counter';
import { getLatestArticles } from '@/data/getArticles';
// import Link from 'next/link';
import NewsList from '@/components/news-list';
// import NewsCard from '@/components/cards/news-card';

export default async function Home() {
  const latestNews = await getLatestArticles(2);

  return (
    <div className="m-auto max-w-6xl border-2">
      {/* <div className="text-3xl font-bold text-red-500">Msrnow.com</div> */}
      {/* replace with a List component, that has a card component */}
      <ul>
        {latestNews === null ? (
          <>load news...</>
        ) : (
          <NewsList newsArticles={latestNews} />
          // latestNews.map((p, i) => (
          //   <NewsCard key={i} article={p} />
            // <Link href={`/news/${p.short_slug}`} key={i}>
            //   <p className="flex flex-col md:flex-row">
            //     {p.title} | [{p.short_slug}] | <ViewCounter slug={p.slug} />
            //   </p>
            // </Link>
        // )
        )}
      </ul>
    </div>
  );
}
