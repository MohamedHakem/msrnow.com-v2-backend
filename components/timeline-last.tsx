export default async function Timeline() {
  return (
    <div>
      <ol dir="ltr" className="relative border-l border-gray-200 dark:border-gray-700">
        <li className="mb-10 ml-4">
          <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 2022</time>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h3>
          <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
            Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order
            E-commerce & Marketing pages.
          </p>
        </li>
        <li className="mb-10 ml-4">
          <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">March 2022</time>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing UI design in Figma</h3>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            All of the pages and components are first designed in Figma and we keep a parity between the two versions
            even as we update the project.
          </p>
        </li>
      </ol>
      <ol dir="rtl" className="relative border-r mx-2 border-gray-200 dark:border-gray-700">
        <li className="mb-10 mr-4">
          <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -right-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 2022</time>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h3>
          <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
            Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order
            E-commerce & Marketing pages.
          </p>
        </li>
        <li className="mb-10 mr-4">
          <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -right-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">March 2022</time>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing UI design in Figma</h3>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            All of the pages and components are first designed in Figma and we keep a parity between the two versions
            even as we update the project.
          </p>
        </li>
      </ol>

      <div className="flex flex-col laptop:flex-row">
        {/* <ol dir="ltr" className="w-1/2 relative border-r border-gray-200 dark:border-gray-700">
          <li className="mb-10 ml-4">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              February 2022
            </time>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h3>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order
              E-commerce & Marketing pages.
            </p>
          </li>
        </ol> */}
        {['card1', 'card2', 'card3', 'card4'].map((t, i) => (
          <ol
            key={i}
            dir={i % 2 == 0 ? 'rtl' : 'ltr'}
            className="w-1/2 pt-[200px] relative border-r border-gray-200 dark:border-gray-700"
          >
            <li className={`mb-10 ${i % 2 === 0 ? 'mr-4' : 'ml-4'}`}>
              <div
                className={`absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 ${
                  i % 2 === 0 ? '-right-1.5' : '-left-1.5'
                } 
                border border-white dark:border-gray-900 dark:bg-gray-700`}
              ></div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                February 2022
              </time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t}</h3>
            </li>
          </ol>
        ))}
      </div>
    </div>
  );
}
