import { Sidebar } from '@/components/navigation/sidebar';
import { Navbar } from '@/components/navigation/navbar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <main className="flex flex-row relative h-[100%]">
        <main className="h-full flex-1 p-4">{children}</main>
        <aside className="hidden border-l-2 border-primary/10 md:flex w-[120px] z-30 flex-col inset-y-0 right-0">
          <Sidebar />
        </aside>
      </main>
    </div>
  );
};
export default MainLayout;
