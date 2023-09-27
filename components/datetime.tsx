import getLocalArabicFromTimestamp from '@/utils/convertTimestampToCustomLocalArabicTime';

export default function Datetime({
  published_at,
  weekday,
  isTimeAgo
}: {
  published_at: number | Date;
  weekday: boolean;
  isTimeAgo: boolean;
}) {
  const datetime = new Date(published_at).toISOString();
  const fullDate = getLocalArabicFromTimestamp(published_at, true, false);
  const displayDate = getLocalArabicFromTimestamp(published_at, weekday, isTimeAgo);
  return (
    <div>
      <time dateTime={`${new Date(published_at).toISOString()}`} title={fullDate}>
        {displayDate}
      </time>
    </div>
  );
}
