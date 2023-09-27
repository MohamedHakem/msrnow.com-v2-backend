export default async function ArticleSidebar() {
  const arr = new Array(5).fill(1);

  return (
    <div className="flex flex-row laptop:min-w-[180px] laptop:flex-col desktop:min-w-[220px] justify-between gap-1 rounded-md border p-2">
      article sidebar
      {arr.map((a, i) => (
        <p key={i} className="h-16 laptop:h-full w-full bg-gray-100 dark:bg-stone-700"></p>
      ))}
    </div>
  );
}
