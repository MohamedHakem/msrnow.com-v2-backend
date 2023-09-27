import PromoteSidebar from '@/components/promote-sidebar';
import { Suspense } from 'react';

export default async function ArticleLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>LAYOUT: Article LOADING</div>}>
      <div className="flex flex-col desktop:flex-row rounded-md gap-4 py-10 px-4 container:px-0 scroll-m-0">
        {children}
        {/* <PromoteSidebar /> */}
      </div>
    </Suspense>
  );
}
