import { timelineArrayType, tweetsArrayType } from '@/types';
import { Tweet } from 'react-tweet';
import TimelineNewsCard from '@/components/cards/timeline-news-card';

function isTweetsArray(item: timelineArrayType): item is tweetsArrayType {
  return 'id' in item && 'published_at' in item;
}

export default async function TimelineCard({ item }: { item: timelineArrayType }) {
  if (isTweetsArray(item)) {
    return (
      <div>
        <Tweet id={item.id} />
      </div>
    );
  }
  return (
    // <div className="w-[50dvw] tablet:w-80 max-w-xs border p-0 rounded-lg mt-4">
    <div className="w-[50dvw] tablet:w-full max-w-xs border p-0 rounded-lg mt-4">
      <TimelineNewsCard article={item} />
    </div>
  );
}

// <div className="p-4 mt-4 border"><p>{item.title}</p></div>;
