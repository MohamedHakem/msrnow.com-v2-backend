'use client';
import { increment } from '@/app/actions';
// call increment action in the article's single page, this is just a RSC views counter for display (check leerob's approach)
// I need useEffect to only call the above action once per article page, not with every re-render
// EDIT: I actually need to call this for every time a visitor clicks on an article, not just hard-reload or 1st-time request,
// but also subsequent clicks between articles and soft-navigations with Link comp.. or back/forth browser btns, all of that should count as new view

import { useEffect } from 'react';

export default function IncrementViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    increment(slug, 'view');
  }, [slug]);

  return <></>;
}
