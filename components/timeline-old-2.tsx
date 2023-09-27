import { Tweet } from "react-tweet";

interface TimelineItemProps {
  completed: boolean;
  title: string;
  deliver: boolean;
}

const items: TimelineItemProps[] = [
  { title: 'card1', completed: true, deliver: true },
  { title: 'card2', completed: true, deliver: true },
  { title: 'card3', completed: true, deliver: true },
  { title: 'card4', completed: true, deliver: true },
  { title: 'card5', completed: true, deliver: true },
  { title: 'card6', completed: true, deliver: true },
  { title: 'card7', completed: true, deliver: true }
];

// export default function Timeline() {
export default function Timeline({ relatedTweets }: { relatedTweets: string[] }) {
  console.log("[Timeline] relatedTweets: ", relatedTweets);

  const events = relatedTweets

  return (
    <div
      dir="rtl"
      className={`space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent`}
    >
      {events.map((item, index) => (
        <div
          key={index}
          className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
        >
          <div className="relative w-full md:w-1/2">
            {/* Marker */}
            <div
              className={`flex flex-row items-center gap-[10px] -mr-[6px] ${
                index % 2 === 0 ? ' md:-mr-[8px]' : 'md:flex-row-reverse md:-ml-2'
              }`}
            >
              <div className="flex items-center space-x-4 md:space-x-reverse">
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded-full md:order-1 bg-emerald-500 ${
                    index % 2 === 0 ? '' : ''
                  }`}
                ></div>
              </div>
              <div className="text-slate-500">
                <span className="text-slate-900 font-bold">Apr 7, 2024</span>
              </div>
            </div>
            {/* Card */}
            <div
              className={`w-fit md:w-full justify-start flex flex-row px-4 py-2 ${
                index % 2 === 0 ? ' md:justify-start' : ' md:justify-end'
              }`}
            >
              <div className="w-0">.</div>
              <div className="rounded border border-slate-200 text-slate-500 shadow p-4 w-auto">
                {/* {item.title} */}
                <Tweet  id={item} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
