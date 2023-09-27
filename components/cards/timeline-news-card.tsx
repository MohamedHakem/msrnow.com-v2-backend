import Link from 'next/link';
import Image from 'next/image';
import ViewCounter from '@/components/view-counter';
import { Share2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import LikesCounter from '@/components/likes-counter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default async function TimelineNewsCard({
  article
}: {
  article: {
    title: string;
    slug: string;
    google_thumb: string;
    article_google_url: string;
    article_source_url: string | null;
    short_slug: string;
    published_at: number | Date;
    likes: number | null;
    shares: number | null;
  };
}) {
  const width = 560;
  const height = 336;
  const imgUrl = article.google_thumb.replace(/=s0-w\d+/, `=s0-w${width}`).replace(/-h\d+/, `-h${height}`);
  // console.log('article.google_thumb: \n', article.google_thumb);
  // console.log('imgUrl: \n', imgUrl);
  return (
    <>
      <Card className="rounded-lg border-0 shadow-none flex flex-col justify-between">
        <Link href={`/news/${article.slug}`}>
          <CardContent className="relative p-0 rounded-lg">
            <AspectRatio ratio={5 / 3} className="overflow-hidden rounded-t-lg">
              <Image
                // src={article.google_thumb}
                src={imgUrl}
                // width={280}
                width={560}
                height={336}
                // fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                alt={article.title}
                className="object-cover hover:scale-105 transition-all duration-300 ease-in-out"
              />
            </AspectRatio>
            <div className="h-full flex flex-col justify-between p-2 pb-0">
              <p className="font-semibold text-base line-clamp-2">{article.title}</p>
            </div>
          </CardContent>
        </Link>

        <Separator className="w-0 m-auto mt-2 mb-1" />

        <CardFooter>
          <div className="w-full text-[#6b6b6b] flex flex-row justify-between items-center h-[30px] px-1">
            <LikesCounter slug={article.slug} likes={article.likes} />
            <Separator orientation="vertical" className="h-[20px]" />
            <span
              className="cursor-pointer hover:bg-secondary p-2 rounded-lg text-[#6b6b6b]/60 hover:text-[#6b6b6b]
            transition-all duration-300 ease-in-out"
            >
              <Share2 strokeWidth={1.25} size={20} />
            </span>
            <Separator orientation="vertical" className="h-[20px]" />
            <p className="justify-end transition-all duration-300 ease-in-out">
              <ViewCounter slug={article.slug} />
            </p>
          </div>
        </CardFooter>
      </Card>
      {/* <div className="border relative w-full h-full flex flex-col rounded-lg shadow-2 overflow-clip">
      <Link href={`/news/${article.slug}`}>
        <Image
          src={article.google_thumb}
          width={280}
          height={168}
          alt={article.title}
          className="w-full"
        />
        <div className="h-full flex flex-col justify-between p-1">
          <p className="font-semibold">{article.title}</p>
        </div>
      </Link>
      <div className="rounded-md flex flex-row mt-auto justify-between items-center p-1">
        <LikesCounter slug={article.slug} likes={article.likes} />
        <span className="p-1 rounded-md justify-center">
          <Share className="text-zinc-500" />
        </span>
        <p className="justify-end">
          <ViewCounter slug={article.slug} />
        </p>
      </div>
    </div> */}
    </>
  );
}
