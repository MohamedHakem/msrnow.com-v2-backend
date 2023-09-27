import SingleArticleSkeleton from '@/components/skeletons/single-article-skeleton';

export default function Loading() {
  return (
    <div className="w-full h-screen">
      {/* <p>LOADING FILE</p> */}
      <SingleArticleSkeleton />
    </div>
  );
}
