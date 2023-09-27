export default async function FeaturedArea() {
  // each section fetches it's own data, and stream it with suspense boundary with some loading UI
  return (
    <div dir="rtl" className="flex flex-col desktop:flex-row gap-2 w-full h-auto p-2">
      <div className="flex flex-col laptop:flex-row laptop:flex-auto desktop:flex-row-reverse gap-2">
        <div className="flex flex-col flex-auto relative h-full border gap-2 p-2">
          <div className="flex flex-col gap-2 h-[600px] tablet:max-h-[500px]">
            <div className="h-1/3 tablet:h-96 bg-gray-100 dark:bg-[#000]"></div>
            <div className="flex flex-col tablet:flex-row h-2/3 tablet:h-auto gap-2">
              <div className="w-full h-1/2 tablet:h-52 bg-gray-100 dark:bg-[#000]"></div>
              <div className="w-full h-1/2 tablet:h-52 bg-gray-100 dark:bg-[#000]"></div>
            </div>
          </div>
          <div className="flex flex-col tablet:flex-row gap-2">
            <div className="flex flex-col flex-auto gap-2">
              <div className="w-full h-16 bg-gray-100 dark:bg-[#000]"></div>
              <div className="w-full h-16 bg-gray-100 dark:bg-[#000]"></div>
            </div>
            <div className="flex flex-col flex-auto gap-2">
              <div className="w-full h-16 bg-gray-100 dark:bg-[#000]"></div>
              <div className="w-full h-16 bg-gray-100 dark:bg-[#000]"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col tablet:flex-row laptop:flex-col laptop:w-52 w-full gap-2 p-2 h-auto border">
          <div className="h-16 w-full tablet:w-1/3 laptop:h-1/3 laptop:w-full bg-gray-100 dark:bg-[#000]">
            inside
          </div>
          <div className="h-16 w-full tablet:w-1/3 laptop:h-1/3 laptop:w-full bg-gray-100 dark:bg-[#000]"></div>
          <div className="h-16 w-full tablet:w-1/3 laptop:h-1/3 laptop:w-full bg-gray-100 dark:bg-[#000]"></div>
        </div>
      </div>

      <div className="flex flex-col tablet:flex-row desktop:flex-col desktop:w-52 w-full gap-2 p-2 h-auto border">
        <div className="h-16 w-full tablet:w-1/3 desktop:h-1/3 desktop:w-full bg-gray-100 dark:bg-[#000]">outside</div>
        <div className="h-16 w-full tablet:w-1/3 desktop:h-1/3 desktop:w-full bg-gray-100 dark:bg-[#000]"></div>
        <div className="h-16 w-full tablet:w-1/3 desktop:h-1/3 desktop:w-full bg-gray-100 dark:bg-[#000]"></div>
      </div>
    </div>
  );
}
