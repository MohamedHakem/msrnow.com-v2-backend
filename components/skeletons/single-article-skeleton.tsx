// import { Skeleton } from '@/components/ui/skeleton';ap-

import TimelineSkeleton from '@/components/skeletons/timeline-skeleton';

export default function SingleArticleSkeleton() {
  const arr = new Array(5).fill(1);

  return (
    <div className="flex flex-col flex-auto h-[100vh] md:flex-row w-[calc(vw - 300px)] rounded-md gap-4 pl-5 laptop:pr-0 scroll-m-0">
      <div className="flex flex-col flex-auto gap-2 h-full rounded-md border items-center p-4">
        <div dir="rtl" className="flex flex-col laptop:flex-row w-full h-full p-2 rounded-md border">
          <div className="hidden laptop:flex flex-col laptop:max-w-[200px] justify-between gap-1 rounded-md border m-4 laptop:m-0 p-2 h-full laptop:w-[150px]">
            {arr.map((a, i) => (
              <p key={i} className="h-full w-full bg-gray-100 dark:bg-stone-700"></p>
            ))}
          </div>

          <div className="flex flex-col desktop:flex-row justify-between flex-auto  gap-16 border mx-4 rounded-md px-4 py-12">
            <div className="flex flex-col desktop:flex-auto max-w-3xl gap-4 border p-8 rounded-md"></div>

            <div className="flex flex-col">
              <div className="flex flex-col gap-4 mt-4 w-[90%] desktop:w-full max-w-md border m-auto rounded-xl pt-4">
                <div className="w-full flex h-auto justify-center items-center">
                  <h3 className="text-2xl font-bold">تغطية الخبر</h3>
                </div>
                <div className="w-full m-auto relative flex flex-col h-[600px] laptop:h-screen border-t shadow-inner">
                  {/* <div dir="rtl" className="w-4"> */}
                  <div
                    dir="rtl"
                    className="space-y-8 mr-3 laptop:ml-3 py-10 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full 
              before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-300 before:to-slate-200 before:animate-blink"
                  >
                    <TimelineSkeleton />
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>

          <div
            className="flex laptop:hidden flex-row laptop:flex-col laptop:max-w-[200px] justify-between gap-1 rounded-md border 
            m-4 laptop:mx-0 p-2 h-full laptop:w-[150px]"
          >
            {arr.map((a, i) => (
              <p key={i} className="h-8 laptop:h-full w-full bg-gray-100 dark:bg-stone-700"></p>
            ))}
          </div>

          <div
            className="flex flex-row laptop:flex-col laptop:max-w-[200px] justify-between gap-1 rounded-md border 
            m-4 laptop:m-0 p-2 h-full laptop:w-[150px]"
          >
            {/* <TimelineSkeleton /> */}

            {arr.map((a, i) => (
              <p key={i} className="h-8 laptop:h-full w-full bg-gray-100 dark:bg-stone-700"></p>
            ))}
          </div>
        </div>
      </div>
      {/* <div className="flex flex-row md:flex-col h-full justify-between gap-1 tablet:min-w-[180px] desktop:min-w-[220px] rounded-md border p-2">
        {arr2.map((a, i) => (
          <p key={i} className="h-16 laptop:h-full w-full bg-gray-100 dark:bg-stone-700"></p>
        ))}
      </div> */}
    </div>
  );
}
