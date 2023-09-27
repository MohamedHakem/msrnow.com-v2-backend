import Link from 'next/link';
import Image from 'next/image';
import ViewCounter from '@/components/view-counter';
import { Share2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import LikesCounter from '@/components/likes-counter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default async function FeaturedNewsCard({
  article
}: {
  article: {
    title: string;
    google_thumb: string;
    views: number | null;
    likes: number | null;
    short_slug: string;
    published_at: Date;
  };
}) {
  return (
    <>
      <Card className="rounded-lg border-0 shadow-none flex flex-col justify-between">
        <Link href={`/news/${article.short_slug}`}>
          <CardContent className="relative p-0 rounded-lg">
            <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-t-lg">
              <Image
                src={article.google_thumb}
                // width={280}
                // height={168}
                fill
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
            <LikesCounter slug={article.short_slug} likes={article.likes} />
            <Separator orientation="vertical" className="h-[20px]" />
            <span
              className="cursor-pointer hover:bg-secondary p-2 rounded-lg text-[#6b6b6b]/60 hover:text-[#6b6b6b]
            transition-all duration-300 ease-in-out"
            >
              <Share2 strokeWidth={1.25} size={20} />
            </span>
            <Separator orientation="vertical" className="h-[20px]" />
            <p className="justify-end transition-all duration-300 ease-in-out">
              <ViewCounter slug={article.short_slug} />
            </p>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
