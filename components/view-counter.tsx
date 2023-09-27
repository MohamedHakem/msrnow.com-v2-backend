// call increment action in the article's single page, this is just a RSC views counter for display (check leerob's approach)
import getViewsBySlug from '@/data/getViews';
import { Eye } from 'lucide-react';

export default async function ViewCounter({ slug }: { slug: string }) {
  const views = await getViewsBySlug(slug);

  return typeof views === 'string' ? (
    <></>
  ) : (
    <span className="dark:text-neutral-400 flex flex-row gap-[2px] p-1 pl-0 rounded-md text-[#6b6b6b]/60 hover:text-[#6b6b6b]">
      <Eye strokeWidth={1.25} size={20} className="h-auto" />
      <span className="text-sm">{views}</span>
    </span>
  );
}
