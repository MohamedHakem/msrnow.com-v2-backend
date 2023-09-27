// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable react/jsx-no-comment-textnodes */
// import { getLatestArticles, getMostViewedArticles, getTopHeadlineArticles } from '@/data/getArticles';
// import { getLocalArabicFromTimestamp as getTimeAgo } from '@/utils/convertTimestampToCustomLocalArabicTime';
// import NextImage from '../NextImage';
// import Link from 'next/link';
// import { ChevronLeft } from 'lucide-react';

// type newsType = {
//   title: string;
//   slug: string;
//   google_thumb: string;
//   article_google_url: string;
//   article_source_url: string | null;
//   likes: number | null;
//   shares: number | null;
//   short_slug: string;
//   published_at: Date;
// };

// type topHeadlineType = {
//   title: string;
//   google_thumb: string;
//   views: number | null;
//   likes: number | null;
//   short_slug: string;
//   published_at: Date;
// };

// export default async function Category({ category, adSize }: { category: string; adSize: string }) {
//   let news: newsType[] | topHeadlineType[] | null = null;

//   if (category === 'أهم العناوين') {
//     news = await getTopHeadlineArticles(12);
//     news = news.slice(6, news.length);
//   } else if (category === 'رائج الان') {
//     news = await getMostViewedArticles(6);
//   } else if (category === 'أخر الأخبار') {
//     news = await getLatestArticles(6);
//   } else if (category === 'ad-section') {
//     return <AdSection size={adSize} />;
//   }

//   if (!news) return null;

//   news.map((a) => console.log('news a.published_at: ', a.published_at));

//   const ArCategoryName = (category: string): string => {
//     if (category === 'أهم العناوين') return 'top-headline';
//     else if (category === 'رائج الان') return 'trending'; // later differentiate between trending Vs most-viewed
//     else if (category === 'أخر الأخبار') return 'latest';
//     return '';
//   };

//   return (
//     <section className="flex flex-col w-full gap-4 px-4">
//       <h2 className="w-full text-3xl font-bold">{category}</h2>
//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
//         <div className="h-full pb-4 lg:col-span-2">
//           <div className="w-full overflow-hidden rounded-lg">
//             {/* <ul className="divide-y divide-gray-100"> */}
//             <ul>
//               {news.map((article, i) => (
//                 <li key={i} className="flex flex-row py-2">
//                   {/* <div className="w-1/2 md:w-1/3"> */}
//                   {/* <div className="w-1/2 md:w-[280px] h-[168px]"> */}
//                   <Link href={`/news/${article.short_slug}`} className="flex flex-row gap-3 md:gap-4 w-full">
//                     <div className="w-1/2 md:w-[280px] h-fit">
//                       <NextImage article={article} width={null} />
//                       {/* <img src={article.google_thumb} className="h-full w-full rounded-lg object-cover" alt="" /> */}
//                     </div>
//                     <div className="flex-col w-1/2 md:w-2/3">
//                       <h4 className="text-sm md:text-lg laptop:text-xl font-bold text-gray-900 leading-5 hover:text-red-500">
//                         {article.title}
//                       </h4>
//                       <div className="mt-1 text-xs text-gray-400">
//                         {/* <span>Business</span> •  */}
//                         <time>{getTimeAgo(article.published_at, false, true)}</time>
//                       </div>
//                     </div>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//             <div className="py-4">
//               <Link href={`/news/${ArCategoryName(category)}`}>
//                 <div className="flex flex-row justify-between p-10 py-6 border rounded-xl text-xl hover:bg-gray-50 transition-all duration-200 ease-in-out">
//                   شاهد المزيد من {category}
//                   <ChevronLeft />
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="h-32 md:h-40 laptop:h-80 sticky top-8 rounded-md bg-gray-50"></div>
//       </div>
//     </section>
//   );
// }

// const AdSection = ({ size }: { size: string }) => {
//   if (size === 'large') {
//     return (
//       <section className="flex flex-col w-full p-2 py-4">
//         <div className="flex flex-col w-full h-full p-6 bg-gray-50 dark:bg-stone-700">
//           {/* <p className="flex justify-end">Ad</p> */}
//           <div className="flex flex-col justify-center items-center h-full w-full gap-5">
//             <p className="flex text-4xl laptop:text-5xl text-[#ddd] font-black">َضع اعلانك هنا</p>
//             <p className="flex text-xl laptop:text-3xl text-[#b7b7b7] font-bold">
//               سَوِّق لمنتجك او خدمتك او صفحتك او موقعك في لحظات
//             </p>
//             <a
//               href="https://m.me/msrnowcom"
//               target={'_blank'}
//               className="flex border py-4 px-12 dark:bg-stone-700/60 text-xl laptop:text-2xl text-[#878787] font-bold
//             hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
//             >
//               َراسلنا وابدأ الان
//             </a>
//           </div>
//         </div>
//       </section>
//     );
//   } else {
//     return (
//       <section className="flex flex-col w-full p-2 py-4">
//         <div className="flex flex-col w-full h-full p-6 bg-gray-50 dark:bg-stone-700">
//           {/* <p className="flex justify-end">Ad</p> */}
//           <div className="flex flex-col justify-center items-center h-full w-full gap-5">
//             <p className="flex text-4xl laptop:text-4xl text-[#ddd] font-black">َضع اعلانك هنا</p>
//             <p className="flex text-xl laptop:text-2xl text-[#b7b7b7] font-bold">
//               سَوِّق لمنتجك او خدمتك او صفحتك او موقعك في لحظات
//             </p>
//             <a
//               href="https://m.me/msrnowcom"
//               target={'_blank'}
//               className="flex border py-4 px-12 dark:bg-stone-700/60 text-xl laptop:text-2xl text-[#878787] font-bold
//             hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
//             >
//               َراسلنا وابدأ الان
//             </a>
//           </div>
//         </div>
//       </section>
//     );
//   }
// };
