import FeaturedArea from '@/components/homepage/featured-area';
import Section from '@/components/homepage/section';
import PromoteSidebar from '@/components/promote-sidebar';
// import TopSection from '@/components/homepage/top-sections';

// const Skeleton = () => {
//   const arr = new Array(20).fill(1);
//   return (
//     <div className="flex flex-col w-full gap-2">
//       {arr.map((a, i) => (
//         <p key={i} className="h-20 w-full bg-gray-100 dark:bg-stone-700"></p>
//       ))}
//     </div>
//   );
// };

const sections = ['أخر الأخبار', 'رائج الان', 'أخبار مصر'];

export default async function Page() {
  return (
    <div className="flex flex-col w-full max-w-6xl m-auto gap-4 pt-0 pb-10 md:py-12 laptop:pt-4 container:px-0 scroll-m-0">
      <div className="flex flex-col flex-auto gap-8 items-center">
        <FeaturedArea />
        <Section category={'ad-section'} />
        {sections.map((section, i) => (
          <div key={i}>
            <Section category={section} />
            <Section category={'ad-section'} />
          </div>
        ))}
        {/* <Skeleton /> */}
      </div>
    </div>
  );
}
