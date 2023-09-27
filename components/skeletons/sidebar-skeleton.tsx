export default function SidebarSkeleton() {
  const arr = new Array(5).fill(1);

  return (
    <div className="flex flex-row laptop:flex-col laptop:max-w-[200px] justify-between gap-1 rounded-md border m-4 laptop:m-0 p-2 h-full laptop:w-[150px]">
      {arr.map((a, i) => (
        <p key={i} className="h-8 laptop:h-full w-full bg-gray-100 dark:bg-stone-700"></p>
      ))}
    </div>
  );
}
