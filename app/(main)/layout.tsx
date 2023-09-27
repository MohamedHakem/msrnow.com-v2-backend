import { BottomNavbar } from '@/components/navigation/bottom-navbar';
import { Navbar } from '@/components/navigation/navbar';
// import { Sidebar } from '@/components/navigation/sidebar';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { WideModeToggle } from '@/components/wide-mode-toggle';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  if (!children) return null;

  return (
    <div dir="rtl" className="flex flex-col overflow-hidden">
      <div className="flex flex-col overflow-hidden">
        <nav className="flex flex-row z-90 items-stretch h-14 md:h-16 border-b w-full">
          <Navbar />
        </nav>
        <main className="grid grid-cols-[1fr] w-full relative overflow-x-hidden overflow-y-auto h-[calc(100vh-64px-32px)]">
          <section className="flex flex-row flex-auto h-[calc(100vh-64px-32px)]">
            <div className="flex flex-col flex-auto gap-2 max-w-6xl m-auto">{children}</div>
          </section>
        </main>
        <div className="flex flex-row justify-between gap-2 items-center border-t p-1 h-8">
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
}
