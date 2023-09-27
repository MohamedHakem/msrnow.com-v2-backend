import { relatedArticleType, timelineArrayType, tweetsArrayType } from '@/types';
// import getLocalArabicFromTimestamp from '@/utils/convertTimestampToCustomLocalArabicTime';
// import { Tweet } from 'react-tweet';
import Datetime from '@/components/datetime';
import TimelineCard from '@/components/timeline-card';
import { ScrollArea } from '@/components/ui/scroll-area';

// interface TimelineItemProps {
//   completed: boolean;
//   title: string;
//   deliver: boolean;
// }

// export default function Timeline() {

export default function Timeline({
  relatedTweets,
  relatedArticles
}: {
  relatedTweets: string[] | null;
  relatedArticles: relatedArticleType[];
}) {
  // console.log('[Timeline3] relatedTweets: ', relatedTweets);
  // console.log('[Timeline3] relatedArticles[0]: ', relatedArticles[0]);

  // const articlesTimestamped = relatedArticles.map((a) => Date.parse(`${a.published_at}`));
  // console.log('🚀 ~ file: timeline-with-tweets.tsx:26 ~ Timeline3 ~ articlesTimestamps:', articlesTimestamps);

  let sortedArray;
  if (relatedTweets !== null) {
    // const tweetsTimestamps = relatedTweets.map((t) => Number(t.split('/')[1]));
    // console.log('🚀 ~ file: timeline-with-tweets.tsx:27 ~ Timeline3 ~ tweetsTimestampts:', tweetsTimestamps);

    const tweetsArray: tweetsArrayType[] = relatedTweets.map((t) => {
      const id = t.split('/')[0];
      const published_at = Number(t.split('/')[1]);
      return { id, published_at };
    });
    // console.log('🚀 ~ file: timeline-with-tweets.tsx:32 ~ Timeline3 ~ tweetsArray:', tweetsArray);

    // const tweetsWithISODate = tweetsArray.map((tweet) => ({
    //   ...tweet,
    //   published_at: new Date(tweet.published_at).toISOString()
    // }));
    // console.log('🚀 ~ file: timeline-with-tweets.tsx:50 ~ tweetsWithISODate ~ tweetsWithISODate:', tweetsWithISODate);

    // const combinedArray = [...tweetsArray, ...relatedArticles];
    const combinedArray: timelineArrayType[] = [
      ...tweetsArray,
      ...relatedArticles.map((article) => ({
        ...article,
        published_at: Date.parse(`${article.published_at}`)
      }))
    ];

    sortedArray = combinedArray.sort((a, b) =>
      typeof a.published_at == 'number' && typeof b.published_at == 'number' ? b.published_at - a.published_at : 0
    );
    // console.log('🚀 ~ file: timeline-with-tweets.tsx:46 ~ sortedArray ~ sortedArray:', sortedArray[0]);

    // sortedArray.map((s) =>
    //   // console.log(
    //   //   'sortedArray: ',
    //   //   s.id ? s.id : s.title,
    //   //   ' - ',
    //   //   s.published_at,
    //   //   ' - ',
    //   //   new Date(s.published_at),
    //   //   ' - '
    //   //   // new Date(s.published_at).toDateString,
    //   //   // ' - ',
    //   //   // new Date(s.published_at).toISOString,
    //   //   // ' - ',
    //   //   // new Date(s.published_at).toLocaleDateString,
    //   //   // ' - ',
    //   //   // new Date(s.published_at).toLocaleString,
    //   //   // ' - ',
    //   //   // new Date(s.published_at).toLocaleTimeString
    //   // )
    // );
    // sortedArray.map((s) => console.log('sortedArray: ', s.published_at, ' - toISOString: ', s.published_at.toISOString()));
  } else {
    // Convert ISO date strings to timestamps
    relatedArticles.forEach((article) => {
      article.published_at = new Date(`${article.published_at}`);
    });

    // Sort the relatedArticles array by date in ascending order
    relatedArticles.sort((a, b) =>
      typeof a.published_at !== 'number' && typeof b.published_at !== 'number'
        ? b.published_at.getTime() - a.published_at.getTime()
        : 0
    );
  }

  // const sortedArray = combinedArray.sort((a, b) => {
  //   const dateA = Date.parse(a.published_at);
  //   const dateB = Date.parse(b.published_at);
  //   return dateA - dateB;
  // });

  // const events = relatedTweets;
  // const events = relatedArticles;
  const events = sortedArray ? sortedArray : relatedArticles;

  // const getCurrentDate = (published_at: number | Date) => {
  //   console.log('published_at: ', published_at);
  //   const currentTime = new Date(published_at).toLocaleString('ar', {
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'numeric',
  //     day: 'numeric',
  //     hour: 'numeric',
  //     minute: 'numeric',
  //     numberingSystem: 'latn',
  //     hour12: true
  //   });
  //   return currentTime.replace(/،/g, ' · ');
  // };

  function isTweetsArray(item: timelineArrayType): item is tweetsArrayType {
    return 'id' in item && 'published_at' in item;
  }

  // <div
  //   dir="rtl"
  //   className={`space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px laptop:before:mx-auto laptop:before:translate-x-0
  //   before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent`}
  // >

  return (
    <>
      <div className="flex flex-col gap-4 laptop:gap-4 mt-4">
        <div className="w-full flex h-auto justify-center items-center">
          <h3 className="text-2xl font-bold">تغطية الخبر</h3>
        </div>
        <div className="w-full laptop:w-[80%] m-auto relative flex flex-col h-[600px]  border rounded-md shadow-inner">
          {/* <div className="h-10 w-full bg-gradient-to-b  from-slate-200  via-slate-300  to-slate-200"></div> */}
          <div className="h-auto w-auto border p-2 font-semibold bg-gray-50">
            <p>تسلسل زمني</p>
          </div>
          <ScrollArea dir="rtl" className="w-4">
            <div
              dir="rtl"
              className="space-y-8 mr-3 laptop:ml-3 py-10 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px laptop:before:mx-auto laptop:before:translate-x-0 
      before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-300 before:to-slate-200 before:animate-blink"
            >
              {events.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center justify-between laptop:justify-normal laptop:even:flex-row-reverse group is-active`}
                >
                  <div className="relative w-full laptop:w-1/2">
                    {/* Marker */}
                    <div
                      className={`flex flex-row items-center gap-[10px] -mr-[4px] ${
                        index % 2 !== 0 ? ' laptop:-mr-[6px]' : 'laptop:flex-row-reverse laptop:-ml-[6px]'
                      }`}
                    >
                      <div className="flex items-center space-x-4 laptop:space-x-reverse">
                        <div
                          className={`flex items-center justify-center w-3 h-3 rounded-full laptop:order-1 animate-pulse ${
                            isTweetsArray(item) ? 'bg-sky-500' : 'bg-emerald-500'
                          }`}
                        ></div>
                      </div>
                      <div className="text-slate-500">
                        <span className="text-slate-900 font-bold">
                          {/* {`${new Date(item.published_at)}`} */}
                          {/* {getLocalArabicFromTimestamp(item.published_at, true, false)} */}
                          <Datetime published_at={item.published_at} weekday={true} isTimeAgo={true} />
                        </span>
                      </div>
                    </div>
                    {/* Card */}
                    <div
                      className={`w-fit laptop:w-full justify-start flex flex-row px-4 pb-0 ${
                        index % 2 !== 0 ? ' laptop:justify-start' : ' laptop:justify-end'
                      }`}
                    >
                      <div className="w-0 text-transparent">.</div>
                      {/* <div className="rounded border border-slate-200 text-slate-500 p-4 w-auto"> */}
                      {/* <div className="flex flex-col max-w-[300px]"> */}
                      <div className="flex flex-col">
                        {/* <p>{isTweetsArray(item) ? <Tweet id={item.id} /> : item.title}</p> */}
                        {/* <p>{isTweetsArray(item) ? item.id : item.title}</p> */}
                        <TimelineCard item={item} />
                        {/* 
                <p>{`${new Date(item.published_at)}`}</p>
                <p></p>
                <p>{getCurrentDate(item.published_at)}</p>
                <p></p>
                <p>{getLocalArabicFromTimestamp(item.published_at, true, false)}</p>
                <p></p>
                <p>{getLocalArabicFromTimestamp(item.published_at, true, true)}</p>
                <p></p>
                <time dateTime={`${new Date(item.published_at).toISOString()}`}>
                  {getLocalArabicFromTimestamp(item.published_at, true, false)}
                </time>
                <p></p>
                <p>{new Date(item.published_at).toLocaleTimeString()}</p>
                <p></p> */}
                        {/* <Datetime published_at={item.published_at} weekday={true} isTimeAgo={false} /> */}
                        {/* <p></p>
                <Datetime published_at={item.published_at} weekday={true} isTimeAgo={true} /> */}
                      </div>
                      {/* <Tweet id={item.split('/')[0]} /> */}
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      {/* <div className="h-[1000px] w-full mt-10 border"></div> */}
    </>
  );
}
