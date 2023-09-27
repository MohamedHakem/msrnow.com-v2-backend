import { Suspense } from 'react';
import ViewCounter from '@/components/view-counter';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { singleArticleType } from '@/types';

export default async function ArticleHeader({ article }: { article: singleArticleType }) {
  const width = 650;
  const height = 390;
  const imgUrl = article.google_thumb.replace(/=s0-w\d+/, `=s0-w${width}`).replace(/-h\d+/, `-h${height}`);

  return (
    <div className="flex flex-col max-w-3xl">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <Suspense fallback={<div className="w-5 h-3 bg-gray-100"></div>}>
        <ViewCounter slug={article.slug} />
      </Suspense>
      {/* <AspectRatio ratio={5 / 3} className="overflow-hidden m-auto"> */}
      <Suspense fallback={<div className="bg-gray-100 h-20 w-full">Image LOADING</div>}>
        <Image
          src={imgUrl}
          width={width}
          height={height}
          alt={article.title}
          // className='m-auto'
          // sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          // className="m-auto hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden"
          // quality={100}
        />
      </Suspense>
      {/* </AspectRatio> */}
    </div>
  );
}
