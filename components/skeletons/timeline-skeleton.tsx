import { Skeleton } from '@/components/ui/skeleton';

export default function TimelineSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
        <div key={index} className={`relative flex items-center justify-between desktop:w-96 group is-active`}>
          <div className="relative w-full gap-4">
            <div className={`flex flex-row items-center gap-[10px] -mr-[4px]`}>
              <div className="flex items-center space-x-4 laptop:space-x-reverse">
                <div
                  className={`flex items-center justify-center w-3 h-3 rounded-full laptop:order-1 animate-pulse`}
                ></div>
              </div>
              <div className="text-slate-500">
                <span className="text-slate-900 font-bold">
                  <Skeleton className="h-2 w-[350px]" />
                  {/* <Datetime published_at={item.published_at} weekday={true} isTimeAgo={true} /> */}
                </span>
              </div>
            </div>
            <div className={`w-fit laptop:w-full justify-start flex flex-row px-4 pb-0`}>
              <div className="w-0 text-transparent">.</div>
              <div className="flex flex-col">
                <Skeleton className="h-12 w-[350px]" />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div
        className="rounded-xl"
        style={{
          height: '150px',
          width: '100%',
          background: 'linear-gradient(to top, #787878, transparent)',
          position: 'absolute',
          bottom: '0px'
        }}
      ></div>
    </>
  );
}
