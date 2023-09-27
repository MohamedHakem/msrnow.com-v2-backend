import { ChevronLeft } from 'lucide-react';

export default function AdSection({ size }: { size: string }) {
  if (size === 'large') {
    return (
      <section className="flex flex-col w-full p-2 py-4">
        <div className="flex flex-col w-full h-full p-6 bg-gray-50 dark:bg-stone-700">
          {/* <p className="flex justify-end">Ad</p> */}
          <div className="flex flex-col justify-center items-center h-full w-full gap-5">
            <p className="flex text-4xl laptop:text-5xl text-[#ddd] font-black">َضع اعلانك هنا</p>
            <p className="flex text-xl laptop:text-3xl text-[#b7b7b7] font-bold">
              سَوِّق لمنتجك او خدمتك او صفحتك او موقعك في لحظات
            </p>
            <a
              href="https://m.me/msrnowcom"
              target={'_blank'}
              className="flex border py-4 px-12 dark:bg-stone-700/60 text-xl laptop:text-2xl text-[#878787] font-bold
            hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
            >
              َراسلنا وابدأ الان
            </a>
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section className="flex flex-col w-full p-2 md:px-4 py-4 my-8">
        <div className="flex flex-col w-full h-full p-6 bg-gray-50 dark:bg-stone-700">
          {/* <p className="flex justify-end">Ad</p> */}
          <div className="flex flex-col justify-center items-center h-full w-full gap-5">
            <p className="flex text-4xl laptop:text-3xl text-[#ddd] font-black">َضع اعلانك هنا</p>
            <p className="flex text-xl laptop:text-xl text-[#b7b7b7] font-bold">
              سَوِّق لمنتجك او خدمتك او صفحتك او موقعك في لحظات
            </p>
            <a href={'https://m.me/msrnowcom'} target={'_blank'}>
              <div
                className="flex flex-row justify-between p-8 py-4 gap-8 items-center border rounded-xl text-xl hover:bg-gray-50 
                active:scale-95 transition-all duration-200 ease-in-out"
              >
                َراسلنا وابدأ الان
                <ChevronLeft />
              </div>
            </a>

            {/* <a
              href="https://m.me/msrnowcom"
              target={'_blank'}
              className="flex border py-3 px-10 dark:bg-stone-700/60 text-xl text-[#878787] font-bold
            hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
            >
              َراسلنا وابدأ الان
            </a> */}
          </div>
        </div>
      </section>
    );
  }
}
