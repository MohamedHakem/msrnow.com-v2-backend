import FeaturedArea from '@/components/homepage/featured-area';
import Section from '@/components/homepage/section';
import TopSection from '@/components/homepage/top-sections';
import { Tweet } from 'react-tweet';

export default async function Page() {
  const arr = new Array(20).fill(1);
  const arr2 = new Array(20).fill(1);
  return (
    <div className="flex flex-col laptop:flex-row laptop:pr-0 rounded-md gap-4 p-4 pl-5 scroll-m-0">
      <div className="flex flex-col flex-auto gap-2 rounded-md border p-2 items-center">
        {/* each section fetches it's own data, and stram it with suspence boundary with some loading UI */}

        {/* 3 types of sections on the homepage:

            1- the page introduction section with Top news and trending news and any HOT news in a unique layout (later)
            2-  a headline on the right and a 1/2 row of article, a section with small sized-article and another with bigger/less articles 
            3- a big section with big centered headline and under it sub-categories in columns or even 1-row each 
        */}

        {/* START: Featured Area (the Top-headlines أهم الاخبار) */}
        <FeaturedArea />
        {/* END: Featured Area */}

        {/* START: top sections */}
        <TopSection>
          {/* <HomeSection3 (latest news) أخر الاخبار /> */}
          <Section category={'أخر الأخبار'} /> {/* Latest articles */}
          {/* <HomeSection1 (Trending News)  رائج الان /> */}
          <Section category={'رائج الان'} /> {/* most viewed articles */}
          {/* <HomeSection4 (PUTOS news) أخبار عن الرئيس /> */}
        </TopSection>
        {/* END top sections */}

        {/* START: Body Sections */}
        {/* <HomeSection5 (Local news (many/with dropdown to choose his area.. suggest area based on geo (next edge) /> */}
        {/* <HomeSection1 (egypt news) /> */}
        {/* <HomeSection5 (celebrities, movies, arts) /> */}
        {/* <HomeSection5 (other categories) /> */}
        {/* END: Body Sections */}

        {/* START INFINITE (Probably won't need this, since the categories are 50+) */}
        <div className="flex flex-col w-full gap-2">
          {/* <HomeSection7 (all by date (desc) on an infinite scroll) /> */}
          {arr.map((a, i) => (
            <p key={i} className="h-20 w-full bg-gray-100 dark:bg-stone-700"></p>
          ))}
        </div>
        {/* END INFINITE */}
      </div>
      <div className="flex flex-row tablet:min-w-[180px] laptop:flex-col desktop:min-w-[220px] justify-between gap-1 rounded-md border p-2">
        {arr2.map((a, i) => (
          <p key={i} className="h-16 laptop:h-full w-full bg-gray-100 dark:bg-stone-700"></p>
        ))}
      </div>
    </div>
  );
}
