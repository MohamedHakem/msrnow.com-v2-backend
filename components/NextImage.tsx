/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { headers } from 'next/headers';

type featuredArticleType = {
  title: string;
  google_thumb: string;
  views: number | null;
  likes: number | null;
  short_slug: string;
  published_at: Date;
};

type newsType = {
  title: string;
  slug: string;
  google_thumb: string;
  article_google_url: string;
  article_source_url: string | null;
  likes: number | null;
  shares: number | null;
  short_slug: string;
  published_at: Date;
};

export default async function NextImage({
  article,
  width
}: {
  article: featuredArticleType | newsType;
  width: number | undefined | null;
}) {
  const headersInsance = headers();
  const userAgent = headersInsance.get('user-agent');
  // console.log('userAgent: ', userAgent);
  const isMobile = userAgent && userAgent.includes('Mobi');
  // console.log('isMobile: ', isMobile);
  // if (isMobile) {}

  if (width) {
    const height = Math.floor(width * (3 / 5));
    const imgUrl = article.google_thumb.replace(/=s0-w\d+/, `=s0-w${width}`).replace(/-h\d+/, `-h${height}`);
    const src2x = article.google_thumb.replace(/=s0-w\d+/, `=s0-w${width * 2}`).replace(/-h\d+/, `-h${height * 2}`);
    const srcset = `${imgUrl} 1x, ${src2x} 2x`;
    return (
      <img
        src={imgUrl}
        alt={article.title}
        width={width}
        height={height}
        srcSet={srcset}
        className="min-w-full min-h-full bg-gray-100"
        // className="w-1/2 md:w-full"
      />
    );
  } else {
    const width = 280;
    const height = Math.floor(width * (3 / 5));
    const imgUrl = article.google_thumb.replace(/=s0-w\d+/, `=s0-w${width}`).replace(/-h\d+/, `-h${height}`);
    const src2x = article.google_thumb.replace(/=s0-w\d+/, `=s0-w${width * 2}`).replace(/-h\d+/, `-h${height * 2}`);
    const srcset = `${imgUrl} 1x, ${src2x} 2x`;

    return (
      <img
        className="h-auto w-full object-cover bg-gray-100 text-transparent"
        srcSet={srcset}
        alt={article.title}
        src={imgUrl}
      />
    );
  }
}
